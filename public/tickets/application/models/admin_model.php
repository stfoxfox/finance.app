<?php

class Admin_Model extends CI_Model 
{

	public function addField($data) 
	{
		$this->db->insert("ticket_custom_fields", 
			array(
				"name" => $data['name'],
				"placeholder" => $data['placeholder'],
				"required" => $data['required'],
				"type" => $data['fieldtype'],
				"selectoptions" => $data['selectoptions'],
				"subtext" => $data['subtext']
			)
		);
	}

	public function updateSettings($data) 
	{
		$this->db->where("ID", 1)->update("site_settings", 
			array(
				"site_name" => $data['site_name'],
				"upload_path" => $data['upload_path'],
				"envato_api_key" => $data['envato_api_key'],
				"envato_api_username" => $data['envato_api_username'],
				"upload_path_relative" => $data['upload_path_relative'],
				"guest_enable" => $data['guest_enable'],
				"file_enable" => $data['file_enable'],
				"site_desc" => $data['site_desc'],
				"site_logo" => $data['site_logo'],
				"ticket_rating" => $data['ticket_rating'],
				"support_email" => $data['support_email'],
				"alert_support_staff" => $data['alert_support_staff'],
				"register" => $data['register'],
				"disable_captcha" => $data['disable_captcha']
			)
		);
	}

	public function updateTwitterSettings($data) 
	{
		$this->db->where("ID", 1)->update("site_settings", 
			array(
				"twitter_name" => $data['twitter_name'],
				"twitter_display_limit" => $data['twitter_display_limit'],
				"twitter_consumer_key" => $data['twitter_consumer_key'],
				"twitter_consumer_secret" => $data['twitter_consumer_secret'],
				"twitter_access_token" => $data['twitter_access_token'],
				"twitter_access_secret" => $data['twitter_access_secret'],
				"update_tweets" => $data['update_tweets']
			)
		);
	}

	public function updateField($id, $data) 
	{
		$this->db->where("ID", $id)->update("ticket_custom_fields", 
			array(
				"name" => $data['name'],
				"placeholder" => $data['placeholder'],
				"required" => $data['required'],
				"type" => $data['fieldtype'],
				"selectoptions" => $data['selectoptions'],
				"subtext" => $data['subtext']
			)
		);
	}

	public function getAgents() 
	{
		return $this->db->where("access_level >= 1")
		->select("email,name,access_level,ID,ticket_responses")->get("users");
	}

	public function getAgent($id) 
	{
		return $this->db->where("ID", $id)->
		where("access_level >=1")->get("users");
	}

	public function deactivateAgent($id) 
	{
		$this->db->where("ID", $id)
		->update("users", array("access_level" => -1));
	}

	public function updateAgent($id, $name, $email, $pass, $accesslevel,
		$image, $catid, $locked_cat
	) {
		$this->db->where("ID", $id)->update("users", 
			array(
				"name" => $name,
				"email" => $email,
				"password" => $pass,
				"access_level" => $accesslevel,
				"bio_pic" => $image,
				"default_ticket_category" => $catid,
				"locked_category" => $locked_cat
			)
		);
	}

	public function getAgentLog($userid, $page) 
	{
		if ($userid) {
			$this->db->where("agent_log.userid", $userid);
		}
		return $this->db->select("users.name, users.email, agent_log.message,
		agent_log.timestamp, agent_log.IP, agent_log.ticketid")
		->join("users", "users.ID = agent_log.userid")
		->order_by("agent_log.ID", "DESC")
		->limit(20,$page)
		->get("agent_log");
	}

	public function getAgentLogCount($userid) 
	{
		if ($userid) {
			$this->db->where("agent_log.userid", $userid);
		}
		$s = $this->db->select("COUNT(*) as num")->get("agent_log");
		$r = $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	}

	public function getUsers($page) 
	{
		return $this->db
		->select("name, email, IP, ID, access_level")
		->order_by("ID", "DESC")
		->limit(20,$page)
		->get("users");
	}

	public function getUserCount() 
	{
		$s = $this->db->select("COUNT(*) as num")->get("users");
		$r = $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	}

	public function getTotalStaff() 
	{
		$s = $this->db->where("access_level > 0")
		->select("COUNT(*) as num")->get("users");
		$r = $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	}

	public function getTotalTickets() 
	{
		$s = $this->db->select("COUNT(*) as num")->get("tickets");
		$r = $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	}

	public function getTotalTicketsClosed() 
	{
		$s = $this->db->where("status",2)
		->select("COUNT(*) as num")->get("tickets");
		$r = $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	}

	public function getTotalTicketsReply() 
	{
		$s = $this->db->select("COUNT(*) as num")->get("ticket_replies");
		$r = $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	}

	public function getUser($userid) 
	{
		return $this->db->where("ID", $userid)
		->select("name, email, IP, ID, access_level")->get("users");
	}

	public function banUser($id) 
	{
		$this->db->where("ID", $id)
		->update("users", array("access_level" => -2));
	}

	public function deleteUser($id) 
	{
		$this->db->where("ID", $id)
		->delete("users");
	}

	public function updateUser($id, $name, $email, $pass, $accesslevel) 
	{
		$this->db->where("ID", $id)->update("users", 
			array(
				"name" => $name,
				"email" => $email,
				"password" => $pass,
				"access_level" => $accesslevel
			)
		);
	}

	public function getUsersSearch($search, $type, $page) 
	{
		if ($type == 0) {
			$this->db->like("name", $search);
		} elseif ($type == 1) {
			$this->db->like("email", $search);
		} elseif ($type == 2) {
			$this->db->like("IP", $search);
		}
		return $this->db->select("name, email, IP, ID, access_level")
		->limit(20,$page)
		->get("users");
	}

	public function getUserCountSearch($search, $type) 
	{
		if ($type == 0) {
			$this->db->like("email", $search);
		} elseif ($type == 1) {
			$this->db->like("name", $search);
		} elseif ($type == 2) {
			$this->db->like("IP", $search);
		}
		$s = $this->db->select("COUNT(*) as num")->get("users");
		$r = $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	}

	public function getIps($page) 
	{
		return $this->db->select("ID,IP,reason,timestamp")
		->limit(20, $page)
		->order_by("ID", "DESC")
		->get("ip_block");
	}

	public function getIpCount() 
	{
		$s = $this->db->select("COUNT(*) as num")->get("ip_block");
		$r = $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	}

	public function blockIp($ip, $reason) 
	{
		$this->db->insert("ip_block", 
			array(
				"IP" => $ip,
				"reason" => $reason,
				"timestamp" => time()
			)
		);
	}

	public function deleteIp($id) 
	{
		$this->db->where("ID", $id)->delete("ip_block");
	}

	public function getArticleCategories() 
	{
		return $this->db->select("ID,name,article_count")
		->get("article_categories");
	}

	public function getArticleCategory($catid) 
	{
		return $this->db->where("ID", $catid)
		->select("ID,name,article_count,article_desc")
		->get("article_categories");
	}

	public function addArticle($title, $catid, $content, $userid) 
	{
		$this->db->insert("articles", 
			array(
				"title" => $title,
				"catid" => $catid,
				"userid" => $userid,
				"timestamp" => time(),
				"content" => $content
			)
		);
	}

	public function updateCategoryCount($catid, $acount) 
	{
		$this->db->where("ID", $catid)->update("article_categories", 
			array(
				"article_count" => $acount
			)
		);
	}

	public function updateKnowledgeSettings($article_voting, $kb_login, $seo) 
	{
		$this->db->where("ID", 1)->update("site_settings", 
			array(
				"article_voting" => $article_voting,
				"kb_login" => $kb_login,
				"disable_seo" => $seo
			)
		);
	}

	public function getArticles($catid, $limit) 
	{
		if($catid > 0) {
			$this->db->where("articles.catid", $catid);
		}
		return $this->db
		->select("articles.title, articles.ID, article_categories.name")
		->join("article_categories", "article_categories.ID = articles.catid")
		->order_by("articles.ID", "DESC")
		->limit(20,$limit)
		->get("articles");
	}

	public function getArticleCount($catid) 
	{
		if($catid > 0) {
			$this->db->where("articles.catid", $catid);
		}
		$s = $this->db->select("COUNT(*) as num")->get("articles");
		$r = $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num; 
	}

	public function deleteArticle($id) 
	{
		$this->db->where("ID", $id)->delete("articles");
	}

	public function getArticle($id) 
	{
		return $this->db->where("articles.ID", $id)
		->select("articles.title, articles.catid, articles.content,
		article_categories.article_count, articles.ID, article_categories.name")
		->join("article_categories", "article_categories.ID = articles.catid")
		->get("articles");
	}

	public function updateArticle($id, $title, $catid, $content) 
	{
		$this->db->where("ID", $id)->update("articles", 
			array(
				"title" => $title,
				"catid" => $catid,
				"content" => $content
			)
		);
	}

	public function addCategory($title, $desc) 
	{
		$this->db->insert("article_categories", 
			array(
				"name" => $title,
				"article_desc" => $desc
			)
		);
	}

	public function deleteCategory($id) 
	{
		$this->db->where("ID", $id)->delete("article_categories");
	}

	public function updateCategory($id,$title,$desc) 
	{
		$this->db->where("ID", $id)->update("article_categories", 
			array(
				"name" => $title,
				"article_desc" => $desc
			)
		);
	}

	public function getRatings($limit) 
	{
		return $this->db
		->select("tickets.subject, tickets.ID as ticketid,
		ticket_ratings.rating")
		->join("tickets", "tickets.ID = ticket_ratings.ticketid")
		->get("ticket_ratings");
	}

	public function getRatingCount() 
	{
		$s = $this->db->select("COUNT(*) as num")->get("ticket_ratings");
		$r = $s->row();
		if (!isset($r->num)) {
			return 0;
		}
		return $r->num;
	}

	public function addTicketCategory($name) 
	{
		$this->db->insert("ticket_categories", array("name" => $name));
	}

	public function deleteTicketCategory($id) 
	{
		$this->db->where("ID", $id)->delete("ticket_categories");
	}

	public function updateTicketCategory($name, $id) 
	{
		$this->db->where("ID", $id)->update("ticket_categories", 
			array(
				"name" => $name
			)
		);
	}

	public function updateCSS($css) 
	{
		$this->db->where("ID", 1)->update("site_settings", 
			array(
				"custom_css" => $css
			)
		);
	}

	public function deleteCustomField($id) 
	{
		$this->db->where("ID", $id)->delete("ticket_custom_fields");
	}

	public function add_canned_response($title, $response) {
		$this->db->insert("canned_responses", array("title" => $title, "response" => $response));
	}

	public function get_canned_responses() 
	{
		return $this->db->get("canned_responses");
	}

	public function get_response($id) 
	{
		return $this->db->where("ID", $id)->get("canned_responses");
	}

	public function delete_response($id) {
		$this->db->where("ID", $id)->delete("canned_responses");
	}

	public function update_response($id, $title, $response) 
	{
		$this->db->where("ID",$id)->update("canned_responses", array(
			"title" => $title,
			"response" => $response
			)
		);
	}
}

?>
