<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Agent extends CI_Controller 
{

	public function __construct() 
	{
		parent::__construct();
		$this->load->model("ticket_model");
		if (!$this->user->loggedin) {
			$this->template->error(
				lang("error_msg_login")
			);
		}

		if ($this->user->info->access_level <=0) {
			$this->template->error(lang("error_msg_access"));
		}
	}

	public function index($type=2,$status=0,$order=0,$priority_order=0,
		$catid=0,$vala=0
	) {
		$this->load->library('pagination'); 

		$config['base_url'] = site_url(
			"agent/index/$type/$status/$order/$priority_order/$catid/");

		$status = intval($status);
		$type = intval($type);
		$order = intval($order);
		$priority_order = intval($priority_order);
		if ($catid == 0) {
			$catid = $this->user->info->default_ticket_category;
		} else {
			$catid = intval($catid);
		}

		if($this->user->info->locked_category) {
			if($catid != $this->user->info->default_ticket_category) {
				$this->template->error(lang("error_msg_4"));
			}
		}
		$vala = intval($vala);


		$categories = array();
		$porder_type = null;
		$picon_type = "glyphicon-arrow-down";
		$toggle_porder = 0;

		if ($order == 0) {
			$order_type = "DESC";
			$toggle_order = 1;
			$icon_type = "glyphicon-arrow-down";
		} else {
			$order_type = "ASC";
			$toggle_order = 0;
			$icon_type = "glyphicon-arrow-up";
		}

		if ($priority_order == 1) {
			$porder_type = "DESC";
			$toggle_porder = 2;
			$picon_type = "glyphicon-arrow-up";
		} elseif ($priority_order == 2) {
			$porder_type = "ASC";
			$toggle_porder = 1;
			$picon_type = "glyphicon-arrow-down";
		}

		if ($type == 1) {
			$tickets = $this->ticket_model->getAllTicketsRepliedBy(
				$status, $this->user->info->ID, $order_type, $porder_type,
				$vala
			);
			$config['total_rows'] = $this->ticket_model
			->getAllTicketsRepliedByCount(
				$status, $this->user->info->ID, $order_type, $porder_type
			);
		} elseif ($type == 2) {
			$categories = $this->ticket_model->getCategories();
			$tickets = $this->ticket_model->getNewTickets(
				$status, $order_type, $porder_type, $catid, $vala
			);
			$config['total_rows'] = $this->ticket_model->getNewTicketsCount(
				$status, $order_type, $porder_type, $catid
			);
		} else {
			if($this->user->info->locked_category) {
					$this->template->error(lang("error_msg_4"));
			}
			$tickets = $this->ticket_model->getAllTickets(
				$status, $order_type, $porder_type, $vala
			);
			$config['total_rows'] = $this->ticket_model->getAllTicketsCount(
				$status, $order_type, $porder_type
			);
		}

		$config['per_page'] = 20;
		$config['uri_segment'] = 8;

		$this->pagination->initialize($config);
		$this->template->loadContent("agent/index.php", 
			array(
				"tickets"=>$tickets,
				"type" => $type,
				"status" => $status,
				"toggle_order" => $toggle_order,
				"icon_type" => $icon_type,
				"toggle_porder" => $toggle_porder,
				"picon_type" => $picon_type,
				"categories" => $categories,
				"catid" => $catid
			)
		);
	}

	public function search() 
	{
		$search = $this->lib_filter->removeHTML($this->input->post("search"));
		$type = intval($this->input->post("type"));
		$tickets = null;

		if ($type == 0) {
			$tickets = $this->ticket_model->getAllTicketsSearchByEmail($search);
		} elseif ($type == 1) {
			$tickets = $this->ticket_model
			->getAllTicketsSearchByTicketMessage($search);
		} elseif ($type == 2) {
			$tickets = $this->ticket_model->getAllTicketsSearchByIP($search);
		} elseif ($type == 3) {
			$category = $this->ticket_model->getCategoryByName($search);
			if ($category->num_rows() == 0) {
				$this->template->error(lang("error_msg_cat"));
			}
			$r=$category->row();
			$catid = $r->ID;
			$tickets = $this->ticket_model
			->getAllTicketsSearchByCategory($catid);
		}

		$this->template->loadContent("agent/search.php", 
			array(
				"search" => $search,
				"type" => $type,
				"tickets" => $tickets
			)
		);
	}

}

?>
