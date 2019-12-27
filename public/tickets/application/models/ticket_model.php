<?php

class Ticket_Model extends CI_Model 
{

	public function getCategories() 
	{
		return $this->db->select("ID, name")->get("ticket_categories");
	}

	public function create($userid, $email, $name, $priority, $category,
	 $subject, $message, $cfields, $attachments, $password=""
	) {
		$fields = array();
		foreach ($cfields as $k=>$v) {
			$fields[] = "{$k}|0***0|{$v}";
		}
		$fields = implode("|1***1|", $fields);
		$this->db->insert("tickets", 
			array(
				"userid" => $userid, 
				"email" => $email, 
				"name" => $name, 
				"timestamp" => time(), 
				"last_reply_timestamp" => time(),
				"priority" => $priority, 
				"category" => $category, 
				"subject" => $subject, 
				"IP" => $_SERVER['REMOTE_ADDR'], 
				"custom_fields" => $fields, 
				"password" => $password
			)
		);
		$ticketid = $this->db->insert_id();
		$this->db->insert("ticket_replies", 
			array(
				"userid" => $userid, 
				"ticketid" => $ticketid, 
				"timestamp" => time(), 
				"message" => $message, 
				"attachments" => $attachments, 
				"IP" => $_SERVER['REMOTE_ADDR']
			)
		);
		$replyid = $this->db->insert_id();
		return array("replyid" => $replyid, "ticketid" => $ticketid);
	}

	public function getAnonTicket($email, $ticketid, $pass) 
	{
		return $this->db->select("ID")->where("email", $email)
		->where("ID", $ticketid)->where("password", $pass)->get("tickets");
	}

	public function getCategory($catid) 
	{
		return $this->db->select("ID, name")
		->where("ID", $catid)->get("ticket_categories");
	}

	public function getCategoryByName($category) 
	{
		return $this->db->select("ID, name")->where("name", $category)
		->get("ticket_categories");
	}

	public function getUserTickets($userid) 
	{
		return $this->db->where("userid", $userid)->where("status <", 2)
		->select("tickets.ID, tickets.replies, tickets.subject, 
			tickets.timestamp, tickets.priority, tickets.status, 
			ticket_categories.name as catname, ticket_categories.ID as catid,
			users.name as replyname, tickets.last_reply_timestamp")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->order_by("tickets.last_reply_timestamp", "DESC")
		->get("tickets");
	}

	public function getClosedUserTickets($userid) 
	{
		return $this->db->where("userid", $userid)->where("status", 2)
		->select("tickets.ID, tickets.replies, tickets.subject, 
			tickets.timestamp, tickets.priority, tickets.status, 
			ticket_categories.name as catname, ticket_categories.ID as catid, 
			users.name as replyname, tickets.last_reply_timestamp")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->order_by("tickets.last_reply_timestamp", "DESC")
		->get("tickets");
	}

	public function getTicket($ticketid, $userid=0)
	{
		if ($userid > 0) {
			$this->db->where("userid", $userid);
		}
		return $this->db->where("tickets.ID", $ticketid)
		->select("tickets.ID, tickets.notes,
			tickets.custom_fields, tickets.close_user, 
			tickets.replies, tickets.email, tickets.IP, tickets.subject, 
			tickets.timestamp, tickets.priority, tickets.status, 
			ticket_categories.name as catname, ticket_categories.ID as catid, 
			users.name as replyname, tickets.name, tickets.password,
			tickets.userid,
			tickets.last_reply_timestamp, tickets.userid, tickets.assigned")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->get("tickets");
	}

	public function getReplies($ticketid, $page, $limit) 
	{
		return $this->db->where("ticketid", $ticketid)
		->select("ticket_replies.ID, ticket_replies.userid, users.name, 
			ticket_replies.message, ticket_replies.timestamp, 
			ticket_replies.staff, ticket_replies.attachments")
		->join("users", "users.ID = ticket_replies.userid", "LEFT OUTER")
		->limit($limit, $page)->order_by("ticket_replies.ID", "DESC")
		->get("ticket_replies");
	}

	public function getAllReplies($ticketid) 
	{
		return $this->db->where("ticketid", $ticketid)
		->select("ticket_replies.ID, ticket_replies.userid, users.name, 
			ticket_replies.message, ticket_replies.timestamp, 
			ticket_replies.staff, ticket_replies.attachments")
		->join("users", "users.ID = ticket_replies.userid", "LEFT OUTER")
		->order_by("ticket_replies.ID", "DESC")
		->get("ticket_replies");
	}

	public function getTotalTicketReplies($ticketid) 
	{
		$s = $this->db->where("ticketid", $ticketid)->select("COUNT(*) as num")
		->get("ticket_replies");
		$r= $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	}

	public function createReply($ticketid, $userid, $message, 
		$staff, $attachment
	) {
		$this->db->insert("ticket_replies", 
			array(
				"ticketid" => $ticketid, 
				"userid" => $userid, 
				"message" => $message, 
				"timestamp" => time(), 
				"staff" => $staff, 
				"attachments" => $attachment, 
				"IP" => $_SERVER['REMOTE_ADDR']
			)
		);
		$replyid = $this->db->insert_id();
		$this->updateTicket($ticketid, $userid, $staff);
		return $replyid;
	}

	public function updateTicket($ticketid, $userid, $staff) 
	{
		if ($staff == 0) {
			$status = 0;
		} elseif ($staff == 1) {
			$status = 1;
		}

		$this->db->where("ID", $ticketid)->set("replies", "replies+1", FALSE)
		->update("tickets", 
			array(
				"last_reply_userid" => $userid, 
				"last_reply_timestamp" => time(), 
				"status" => $status
			)
		);
	}

	public function closeTicket($ticketid, $userid) 
	{
		$this->db->where("ID", $ticketid)->update("tickets", 
			array(
				"status" => 2, 
				"close_user" => $userid
			)
		);
	}

	public function increaseTicketPriority($ticketid) 
	{
		$this->db->where("ID", $ticketid)->set("priority", "priority+1", FALSE)
		->update("tickets");
	}

	public function decreaseTicketPriority($ticketid) 
	{
		$this->db->where("ID", $ticketid)->set("priority", "priority-1", FALSE)
		->update("tickets");
	}

	public function getCustomFields() 
	{
		return $this->db->select("ID,name,placeholder,type,required,
			selectoptions,subtext")->get("ticket_custom_fields");
	}

	public function getCustomField($id) 
	{
		return $this->db->where("ID", $id)->select("ID,name,placeholder,type,
			required,selectoptions,subtext")->get("ticket_custom_fields");
	}

	public function addFileToTicket($replyid, $file) 
	{
		$this->db->insert("ticket_file_uploads", 
			array(
				"replyid" => $replyid, 
				"full_path" => $file['full_path'], 
				"file_name" => $file['file_name'], 
				"file_ext" => $file['file_ext'], 
				"IP" => $_SERVER['REMOTE_ADDR'], 
				"timestamp" => time()
			)
		);
	}

	public function getAttachments($replyid) 
	{
		return $this->db->select("full_path, file_name, file_ext, IP")
		->where("replyid", $replyid)->get("ticket_file_uploads");
	}

	public function getNewTickets($status, $order, $porder,$catid,$vala) 
	{
		if ($porder ===null) {
			$this->db->order_by("tickets.last_reply_timestamp", $order);
		} else {
			$this->db->order_by("tickets.priority", $porder);
		}
		if($catid > 0) {
			$this->db->where("tickets.category", $catid);
		}
		return $this->db->where("status != 2")->where("tickets.assigned", "")
		->select("tickets.ID, tickets.name, tickets.replies, tickets.subject, 
			tickets.timestamp, tickets.priority, tickets.status, 
			ticket_categories.name as catname, ticket_categories.ID as catid, 
			users.name as replyname, tickets.last_reply_timestamp")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->limit(20, $vala)
		->get("tickets");
	} 

	public function getNewTicketsCount($status, $order, $porder,$catid) 
	{
		if ($porder ===null) {
			$this->db->order_by("tickets.last_reply_timestamp", $order);
		} else {
			$this->db->order_by("tickets.priority", $porder);
		}
		if ($catid > 0) {
			$this->db->where("tickets.category", $catid);
		}
		$s = $this->db->where("status", $status)->where("tickets.assigned", "")
		->select("COUNT(*) as num")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->get("tickets");
		$r= $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	} 

	public function getAllTickets($status, $order,$porder,$vala) 
	{
		if ($porder ===null) {
			$this->db->order_by("tickets.last_reply_timestamp", $order);
		} else {
			$this->db->order_by("tickets.priority", $porder);
		}
		return $this->db->where("status", $status)
		->select("tickets.ID, tickets.name, tickets.replies, tickets.subject, 
			tickets.timestamp, tickets.priority, tickets.status, 
			ticket_categories.name as catname, ticket_categories.ID as catid, 
			users.name as replyname, tickets.last_reply_timestamp")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->limit(20, $vala)
		->get("tickets");
	}  

	public function getAllTicketsCount($status, $order,$porder) 
	{
		if ($porder ===null) {
			$this->db->order_by("tickets.last_reply_timestamp", $order);
		} else {
			$this->db->order_by("tickets.priority", $porder);
		}
		$s = $this->db->where("status", $status)->
		select("COUNT(*) as num")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->get("tickets");
		$r= $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	} 

	public function getAllTicketsRepliedBy($status, $userid, $order,
	$porder,$vala
	) {
		if ($porder ===null) {
			$this->db->order_by("tickets.last_reply_timestamp", $order);
		} else {
			$this->db->order_by("tickets.priority", $porder);
		}
		return $this->db->where("tickets.status", $status)
		->like("tickets.assigned", "U" . $userid . "U")
		->select("tickets.ID, tickets.name, tickets.replies, tickets.subject, 
			tickets.timestamp, tickets.priority, tickets.status, 
			ticket_categories.name as catname, ticket_categories.ID as catid, 
			users.name as replyname, tickets.last_reply_timestamp")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->group_by("tickets.ID")
		->limit(20, $vala)
		->get("tickets");
	}

	public function getAllTicketsRepliedByCount($status, $userid, 
		$order, $porder
	) {
		if ($porder ===null) {
			$this->db->order_by("tickets.last_reply_timestamp", $order);
		} else {
			$this->db->order_by("tickets.priority", $porder);
		}
		$s = $this->db->where("tickets.status", $status)
		->like("tickets.assigned", "U" . $userid . "U")
		->select("COUNT(*) as num")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->group_by("tickets.ID")
		->get("tickets");
		$r= $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	}

	public function getAllTicketsSearchByEmail($email) 
	{
		$this->db->order_by("tickets.last_reply_timestamp", "DESC");
		return $this->db->where("tickets.email", $email)
		->select("tickets.ID, tickets.name, tickets.replies, tickets.subject, 
			tickets.timestamp, tickets.priority, tickets.status, 
			ticket_categories.name as catname, ticket_categories.ID as catid, 
			users.name as replyname, tickets.last_reply_timestamp")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->get("tickets");
	
	}

	public function getAllTicketsSearchByIP($IP) 
	{
		$this->db->order_by("tickets.last_reply_timestamp", "DESC");
		return $this->db->where("tickets.IP", $IP)
		->select("tickets.ID, tickets.name, tickets.replies, tickets.subject, 
			tickets.timestamp, tickets.priority, tickets.status, 
			ticket_categories.name as catname, ticket_categories.ID as catid, 
			users.name as replyname, tickets.last_reply_timestamp")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->get("tickets");
	
	}

	public function getAllTicketsSearchByCategory($catid) 
	{
		$this->db->order_by("tickets.last_reply_timestamp", "DESC");
		return $this->db->where("tickets.category", $catid)
		->select("tickets.ID, tickets.name, tickets.replies, tickets.subject, 
			tickets.timestamp, tickets.priority, tickets.status, 
			ticket_categories.name as catname, ticket_categories.ID as catid, 
			users.name as replyname, tickets.last_reply_timestamp")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->get("tickets");
	
	}

	public function getAllTicketsSearchByTicketMessage($search) 
	{
		$this->db->order_by("tickets.last_reply_timestamp", "DESC");
		return $this->db->like("ticket_replies.message", $search)
		->select("tickets.ID, tickets.name, tickets.replies, tickets.subject, 
			tickets.timestamp, tickets.priority, tickets.status, 
			ticket_categories.name as catname, ticket_categories.ID as catid, 
			users.name as replyname, tickets.last_reply_timestamp")
		->join("ticket_replies", "ticket_replies.ticketid = tickets.ID")
		->join("users", "users.ID = tickets.last_reply_userid", "LEFT OUTER")
		->join("ticket_categories", "ticket_categories.ID = tickets.category")
		->group_by("tickets.ID")
		->get("tickets");
	
	}

	public function addAgentLog($userid, $message, $ticketid) 
	{
		$this->db->insert("agent_log", 
			array(
				"userid" => $userid, 
				"message" => $message, 
				"ticketid" => $ticketid, 
				"timestamp" => time(), 
				"IP" => $_SERVER['REMOTE_ADDR']
			)
		);
	}

	public function increaseTicketResponses($userid) 
	{
		$this->db->where("ID", $userid)
		->set("ticket_responses", "ticket_responses+1", FALSE)->update("users");
	}

	public function getRating($ticketid) 
	{
		return $this->db->select("rating")->where("ticketid", $ticketid)
		->get("ticket_ratings");
	}

	public function addRating($ticketid,$userid,$rate) 
	{
		$this->db->insert("ticket_ratings", 
			array(
				"userid" => $userid, 
				"ticketid" => $ticketid, 
				"rating" => $rate, 
				"IP" => $_SERVER['REMOTE_ADDR']
			)
		);
	}

	public function update_notes($ticketid, $notes) {
		$this->db->where("ID", $ticketid)->update("tickets", 
			array("notes" => $notes));
	}

	public function get_canned_responses() {
		return $this->db->select("ID,title,response")->get("canned_responses");
	}

	public function get_ticket_reply($id) {
		return $this->db->where("ID", $id)->get("ticket_replies");
	}

	public function update_ticket($id,$message) {
		$this->db->where("ID", $id)->update("ticket_replies", array(
			"message" => $message
			)
		);
	}

	public function update_assigned($assigned,$ticketid) {
		$this->db->where("ID", $ticketid)->update("tickets", array(
			"assigned" => $assigned
			)
		);
	}

	public function get_user($userid) {
		return $this->db->where("ID", $userid)->get("users");
	}

	public function get_staff() {
		return $this->db->where("access_level > 0")->get("users");
	}
}

?>
