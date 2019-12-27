<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tickets extends CI_Controller 
{

	public function __construct() 
	{
		parent::__construct();
		$this->load->model("ticket_model");
		$this->load->model("ip_model");
		$this->load->library('email');
	}

	public function index() 
	{
		$this->template->loadContent("ticket/index.php", array());
	}

	public function your() 
	{
		if(!$this->user->loggedin) {
			$this->template->error(
				lang("error_msg_login")
			);
		}
		$tickets = $this->ticket_model->getUserTickets($this->user->info->ID);

		$this->template->loadContent("ticket/your.php", 
			array("tickets" => $tickets));
	}

	public function old() 
	{
		if (!$this->user->loggedin) {
			$this->template->error(lang("error_msg_login"));
		}
		$tickets = $this->ticket_model->getClosedUserTickets(
			$this->user->info->ID);

		$this->template->loadContent("ticket/your.php", 
			array("tickets" => $tickets));
	}

	public function anon() 
	{
		$this->template->loadContent("ticket/anon.php", array());
	}

	public function anon_pro() 
	{
		if(isset($_POST['email'])) {
			$email = $this->lib_filter->removeHTML(
				$this->input->post("email", true)
			);
			$ticketid = intval($this->input->post("ticketid", true));
			$pass = $this->lib_filter->removeHTML($this->input->post("pass", true));
		} else {
			$email = $this->lib_filter->removeHTML($this->input->get("email"));
			$ticketid = intval($this->input->get("ticketid"));
			$pass = $this->lib_filter->removeHTML($this->input->get("pass"));
		}

		if (empty($pass)) {
			$this->template->error(lang("error_msg_tik1"));
		}

		// Get anon ticket with these detaisl
		$ticket = $this->ticket_model->getAnonTicket(
			$email, $ticketid, $pass);
		if ($ticket->num_rows() ==0 ) {
			$this->template->error(lang("error_msg_tik2"));
		}

		// Grant Temp Access
		$_SESSION['tid'] = $ticketid;
		$_SESSION['cod'] = md5("blowfish28273273_" . $ticketid);

		redirect(site_url("tickets/view/" . $ticketid));

	}

	public function create()
	{
		if (!$this->settings->info->guest_enable) {
			if (!$this->user->loggedin) {
				$this->template->error(lang("error_msg_tik3"));
			}
		}

		// IP Block check
		if ($this->ip_model->checkIpIsBlocked($_SERVER['REMOTE_ADDR'])) {
			$this->template->error(lang("error_msg_ip"));
		}

		$this->template->loadExternal('<script type="text/javascript" src="'
		.base_url().'scripts/ticket.js" /></script><script src="'.base_url()
			.'scripts/tinymce/tinymce.min.js"></script>
			<script src="'.base_url().'scripts/tinymce/config.js"></script>');
		$this->load->helper('email');
		$this->load->library('upload');

		if (isset($_POST['s'])) {
			$email = $this->input->post("email", true);
			$name = $this->lib_filter->removeHTML(
				$this->input->post("name", true));
			$priority = intval($this->input->post("priority", true));
			$category = intval($this->input->post("category", true));
			$subject = $this->lib_filter->removeHTML(
				$this->input->post("subject", true));
			$message = $this->lib_filter->go(
				$this->input->post("message"));

			if(!$this->settings->info->disable_captcha) {
				$captcha = $this->input->post("captcha", true);
				if ($captcha != $_SESSION['sc']) {
					$fail = lang("error_msg_reg1");
				}
			}

			if ($priority < 0 || $priority > 3) $fail = lang("error_msg_tik4");

			if ($this->ticket_model->getCategory($category)->num_rows() == 0) {
				$fail = lang("error_msg_tik5");
			}

			if (strlen($name) > 255) {
				$fail = lang("error_msg_reg6");
			}

			if (empty($email)) {
				$fail = lang("error_msg_reg7");
			}

			if (empty($subject)) {
				$fail = lang("error_msg_tik6");
			}

			if (empty($message)) {
				$fail = lang("error_msg_tik7");
			}

			if (!valid_email($email)) {
				$fail = lang("error_msg_reg8");
			}

			// Check Custom Fields for valid data
			$custom_fields = $this->ticket_model->getCustomFields();
			$cfields = array();
			foreach ($custom_fields->result() as $r) {

				$data = $this->input->post("custom-field-" . $r->ID, true);
				if ($r->type== 0) {
					$type = "text";
					$data = $this->lib_filter->removeHTML($data);
				} elseif ($r->type == 1) {
					$type = "email";
					if (!valid_email($data)) {
						$fail = lang("error_msg_reg8");
					}
				} elseif ($r->type == 2) {
					$options = explode(",",$r->selectoptions);
					$pass=0;
					foreach ($options as $k=>$v) {
						if ($data == $k) {
							$pass = 2;
							$data = $v;
						}
					}
					if ($pass == 0) $fail = lang("error_msg_tik8");
				} elseif ($r->type == 3) {
					if (empty($this->settings->info->envato_api_key)) {
						$this->template->error(
							lang("error_msg_tik9"));
					}
					require APPPATH . 'third_party/Envato_marketplaces.php';
					$Envato = new Envato_marketplaces();
					$Envato->set_cache_dir(
						APPPATH . 'third_party/envato_cache/');
					$Envato->set_api_key($this->settings->info->envato_api_key);

					$verify = $Envato->verify_purchase(
						$this->settings->info->envato_api_username, $data);

					// Quickie test. 
					if (isset($verify->buyer)) {  
					    $json_data = json_decode($ch_data, true);  
					    if ($json_data['verify-purchase']['item_name']) {
							$data .= " - VERIFIED 
							({$json_data['verify-purchase']['item_name']})";
					    } else {
					    	$data .= " - " . lang("pg_sp_verify");
					    }
					} else {  
					    $data .= " - " . lang("pg_sp_verify_fail");
					} 
				}

				if ($r->required) {
					if (empty($data)) {
						$fail = lang("error_msg_tik10") . $r->name . "!";
					}
				}
				$cfields[$r->name] = $data;

			}


			$fileInfo = array();
			if ($this->settings->info->file_enable) {
				// File upload script
				$this->upload->initialize(array( 
			       "upload_path" => $this->settings->info->upload_path,
			       "overwrite" => FALSE,
			       "max_filename" => 300,
			       "encrypt_name" => TRUE,
			       "remove_spaces" => TRUE,
			       "allowed_types" => "txt|gif|jpg|png|jpeg|",
			       "max_size" => 600,
			       "xss_clean" => TRUE
			    ));

				$attachments = 0;
			    if ($this->upload->do_multi_upload("files")) {
			    	$attachments = 1;
	      			$fileInfo = $this->upload->get_multi_upload_data();
	      		}
      		} else {
      			$attachments = 0;
      		}


			if (empty($fail)) {
				
				$pass = "";

				// Check if user is anon
				if (!$this->user->loggedin) {
					if (!$this->settings->info->guest_enable) {
						$this->template->error(lang("error_msg_tik3"));
					}
					$pass = $this->common->randomPassword();
					$userid = 0;
				} else {
					$userid = $this->user->info->ID;
					unset($_SESSION['tid']);
					unset($_SESSION['cod']);
				}

				$data = $this->ticket_model
							 ->create($userid, $email, $name, $priority, 
							 $category, $subject, $message, $cfields, 
							 $attachments, $pass);
				$replyid = $data['replyid'];
				$ticketid = $data['ticketid'];
				if ($this->settings->info->file_enable) {
					if(count($fileInfo) > 0) {
						foreach ($fileInfo as $file) {
		      				$this->ticket_model->addFileToTicket($replyid, $file);
		      			} 
	      			}
	      		}
      			if (!$this->user->loggedin) {
      				// Grant Temp Access
					$_SESSION['tid'] = $ticketid;
					$_SESSION['cod'] = md5("blowfish28273273_" . $ticketid);
					$msg = lang("flash_data_p29") . " $ticketid, ". lang("flash_data_p30") .
					" $email ".lang("flash_data_p31")." $pass - "
      					.lang("flash_data_p32");
      				$this->session->set_flashdata("globalmsg", $msg);
      				

					$this->email->from($this->settings->info->support_email,
					 $this->settings->info->site_name);
					$this->email->to($email);

					$this->email->subject('Ticket Creation #'.$ticketid);
					$this->email->message(lang("email_part1").$name.', <br /><br /> 
						'.lang("email_part6").$this->settings->info->site_name.'.'
						.lang("email_part7").'<br /><br /> 
						TicketID: '.$ticketid.' <br /><br /> Email: '.$email.'
						 <br /><br /> Ticket Password: '.$pass.' <br /><br />
						 '. lang("email_part16") . '<br /> <a href="'. 
						 site_url("tickets/anon_pro/?ticketid=" . $ticketid .
						  "&email=" . $email . "&pass=" . $pass) . '">' 
						 . site_url("tickets/anon_pro/?ticketid=" . $ticketid .
						  "&email=" . $email . "&pass=" . $pass) . '</a><br /><br />
						 '.lang("email_part8").'<a href="'.site_url().'">'.site_urL()
						 .'</a> '.lang("email_part9").' <br /><br /> 
						 '.lang("email_part5").$this->settings->info->site_name);

					$this->email->send();
      			} else {
      				$this->session->set_flashdata("globalmsg", 
      					lang("flash_data_p33"));
      			}

      			// Email Staff 
	  			if($this->settings->info->alert_support_staff) {
	  				$this->load->model("admin_model");
	  				$agents = $this->admin_model->getAgents();
	  				foreach($agents->result() as $rr) {
	  					$this->email->from($this->settings->info->support_email,
						 $this->settings->info->site_name);
						$this->email->to($rr->email);

						$this->email->subject(lang("email_part15") . '(#'.$ticketid.')');
						$this->email->message('Dear '.$rr->name.',<br /><br />
							'.lang("email_part13")
							.$ticketid.'. '.lang("email_part14").
							' <a href="' . site_url().'">' . site_url() . '</a>.');

						$this->email->send();
	  				}
	  			}
				redirect(site_url("tickets/view/" . $ticketid));
			}
		}

		$categories = $this->ticket_model->getCategories();

		if(!$this->settings->info->disable_captcha) {
			$this->load->helper("captcha");
			$rand = rand(4000,100000);
			$_SESSION['sc'] = $rand;
			$vals = array(
			    'word' => $rand,
			    'img_path' => './images/captcha/',
	    		'img_url' => base_url() . 'images/captcha/',
			    'img_width' => 150,
			    'img_height' => 30,
			    'expiration' => 7200
			    );

			$cap = create_captcha($vals);
		} else { 
			$cap = "";
		}

		$custom_fields = $this->ticket_model->getCustomFields();

		if (!empty($fail)) { 
			$this->template->loadContent("ticket/create.php", 
				array(
					"fail" => $fail,
					"cap" => $cap, 
					"name" => $name, 
					"email" => $email, 
					"priority" => $priority, 
					"category" => $category, 
					"message" => $message, 
					"subject" => $subject, 
					"categories" => $categories, 
					"custom_fields" => $custom_fields
				)
			);
		} else {
			if ($this->user->loggedin) {
				$email = $this->user->info->email;
				$name = $this->user->info->name;
				$msg = null;
			} else {
				$email = null;
				$name = null;
				$msg = null;
			}
			if (isset($_POST['tmp_ticket'])) {
				$email = $this->lib_filter->removeHTML(
					$this->input->post("tmp_email", true));
				$name = $this->lib_filter->removeHTML(
					$this->input->post("tmp_name", true));
				$msg = $this->lib_filter->removeHTML(
					$this->input->post("tmp_message", true));
			}
			$this->template->loadContent("ticket/create.php", 
				array(
					"cap" => $cap,
					"categories" => $categories, 
					"custom_fields" => $custom_fields, 
					"name" => $name, 
					"email" => $email, 
					"message" => $msg
				)
			);
		}

	}

	public function view($ticketid, $page=0) 
	{

		$this->template->loadExternal('<script type="text/javascript" src="
			'.base_url().'scripts/ticket.js" /></script><script src="'.base_url()
			.'scripts/tinymce/tinymce.min.js"></script>
			<script src="'.base_url().'scripts/tinymce/config.js"></script>');
		$ticketid = intval($ticketid);
		$page = intval($page);
		$per_page = 10;

		// Check anon ticket access
		$this->anon_access($ticketid);

		if (isset($_SESSION['tid']) && $_SESSION['tid'] >0) {
			$ticket = $this->ticket_model->getTicket($ticketid);
		} elseif ($this->user->loggedin) {
			if ($this->user->info->access_level > 0) {
				$ticket = $this->ticket_model->getTicket($ticketid);
			} else {
				$ticket = $this->ticket_model->getTicket(
					$ticketid, $this->user->info->ID);
			}
		} else {
			$this->template->error(lang("error_msg_login"));
		}
		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik11"));
		}
		$ticket = $ticket->row();

		$replies = $this->ticket_model->getReplies(
			$ticketid, $page, $per_page);

		$this->load->library('pagination');

		$config['base_url'] = site_url("tickets/view/" . $ticketid . "/");
		$config['total_rows'] = $this->ticket_model
								->getTotalTicketReplies($ticketid);
		$config['per_page'] = $per_page;
		$config['uri_segment'] = 4;

		$this->pagination->initialize($config);

		$rep = array();
		foreach ($replies->result() as $r) {
			$rep[] = $r;
		}
		$rep = array_reverse($rep);

		$ratingFlag = 0;
		$rating=null;
		if ($ticket->status == 2) {
			if ($this->settings->info->ticket_rating) {
				// Check for rating
				$rating = $this->ticket_model->getRating($ticketid);
				if ($rating->num_rows() > 0) {
					$ratingFlag=1;
					$rating=$rating->row();
				}
			}
		}

		if($this->user->loggedin && $this->user->info->access_level> 0) {
			$responses = $this->ticket_model->get_canned_responses();
		} else {
			$responses=null;
		}

		$this->template->loadContent("ticket/view.php", 
			array(
				"ticket" => $ticket,
				"replies" => $rep,
				"reply_count" => count($rep),
				"ratingFlag" => $ratingFlag,
				"rating" => $rating,
				"responses" => $responses
			)
		);

	}

	public function pprint($ticketid) 
	{
		
		$this->template->loadExternal('<script type="text/javascript" src="
			'.base_url().'scripts/ticket.js" /></script>');
		$ticketid = intval($ticketid);
		$per_page = 10;

		// Check anon ticket access
		$this->anon_access($ticketid);

		if (isset($_SESSION['tid']) && $_SESSION['tid'] >0) {
			$ticket = $this->ticket_model->getTicket($ticketid);
		} elseif ($this->user->loggedin) {
			if ($this->user->info->access_level > 0) {
				$ticket = $this->ticket_model->getTicket($ticketid);
			} else {
				$ticket = $this->ticket_model->getTicket(
					$ticketid, $this->user->info->ID);
			}
		} else {
			$this->template->error(lang("error_msg_login"));
		}
		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik11"));
		}
		$ticket = $ticket->row();

		$replies = $this->ticket_model->getAllReplies(
			$ticketid);

		$rep = array();
		foreach ($replies->result() as $r) {
			$rep[] = $r;
		}
		$rep = array_reverse($rep);

		$ratingFlag = 0;
		$rating=null;
		if ($ticket->status == 2) {
			if ($this->settings->info->ticket_rating) {
				// Check for rating
				$rating = $this->ticket_model->getRating($ticketid);
				if ($rating->num_rows() > 0) {
					$ratingFlag=1;
					$rating=$rating->row();
				}
			}
		}

		$this->template->loadAjax("ticket/print.php", 
			array(
				"ticket" => $ticket,
				"replies" => $rep,
				"reply_count" => count($rep),
				"ratingFlag" => $ratingFlag,
				"rating" => $rating
			)
		);

	}

	public function rating($ticketid) 
	{
		if (!$this->settings->info->ticket_rating) {
			$this->template->error(lang("error_msg_tik12"));
		}
		if (!$this->user->loggedin) {
			$this->template->error(lang("error_msg_login"));
		}
		$ticketid = intval($ticketid);
		$ticket = $this->ticket_model->getTicket(
			$ticketid, $this->user->info->ID);
		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik11"));
		}

		$rating = $this->ticket_model->getRating($ticketid);
		if ($rating->num_rows() > 0) {
			$this->template->error(lang("error_msg_tik13"));
		}

		$rate = intval($this->input->post("rate", true));
		if ($rate <=0 || $rate > 5) {
			$this->template->error(lang("error_msg_tik14"));
		}

		$this->ticket_model->addRating($ticketid,$this->user->info->ID,$rate);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p34"));
		redirect(site_url("tickets/view/" . $ticketid));
	}

	public function reply($ticketid) 
	{
		$ticketid = intval($ticketid);

		//Check Anon Access
		$this->anon_access($ticketid);

		if (isset($_SESSION['tid']) && $_SESSION['tid'] >0) {
			$ticket = $this->ticket_model->getTicket($ticketid);
			$staffFlag = 0;
			$userid = 0;
		} elseif ($this->user->loggedin) {
			if ($this->user->info->access_level > 0) {
				$staffFlag = 1;
				$ticket = $this->ticket_model->getTicket($ticketid);
			} else {
				$staffFlag = 0;
				$ticket = $this->ticket_model->getTicket(
					$ticketid, $this->user->info->ID);
			}
			$userid = $this->user->info->ID;
		} else {
			$this->template->error(lang("error_msg_login"));
		}

		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik11"));
		}

		$message = $this->lib_filter->go(
			$this->input->post("message"));
		if (empty($message)) $this->template->error(
			lang("error_msg_tik15"));

		$r = $ticket->row();
		if ($r->status == 2) $this->template->error(
			lang("error_msg_tik16"));

		$fileInfo=array();
		if ($this->settings->info->file_enable) {
			$this->load->library('upload');
			// File upload script
			$this->upload->initialize(array(
		       "upload_path" => $this->settings->info->upload_path,
		       "overwrite" => FALSE,
		       "max_filename" => 300,
		       "encrypt_name" => TRUE,
		       "remove_spaces" => TRUE,
		       "allowed_types" => "txt|gif|jpg|png|jpeg|",
		       "max_size" => 300,
		       "xss_clean" => TRUE
		    ));

			$fileInfo = array();
			$attachments = 0;
		    if ($this->upload->do_multi_upload("files")) {
		    	$attachments = 1;
	  			$fileInfo = $this->upload->get_multi_upload_data();
	  		}
  		} else {
  			$attachments = 0;
  		}

		$replyid = $this->ticket_model->createReply(
			$r->ID, $userid, $message, $staffFlag, $attachments);
		if(count($fileInfo) > 0) {
			foreach ($fileInfo as $file) {
				$this->ticket_model->addFileToTicket($replyid, $file);
			}
		}

		if ($staffFlag) {
			$addflag = 0;
			$tick = $ticket->row();
			$assigned = explode("***", $tick->assigned);
			foreach($assigned as $user) {
				$uid = str_replace("U", "", $user);
				if($uid == $this->user->info->ID) {
					$addflag = 1;
				}
			}
			if(!$addflag) {
				// Assigned staff member to ticket
				$assigned[] = "U".$this->user->info->ID."U";
				$assigned = implode("***", $assigned);
				$this->ticket_model->update_assigned($assigned,$ticketid);
			}
			// Send Email to ticket owner
			$this->load->library('email');

			$this->email->from($this->settings->info->support_email, 
				$this->settings->info->site_name);
			$this->email->to($r->email);

			$message = 'Dear '.$r->name.', <br /><br /> '
			. lang("email_part10").$this->settings->info->site_name.'. '
			.lang("email_part8") .'<a href="'.site_url().'">'.site_urL()
			.'</a> '.lang("email_part9").' <br /><br />';
			if($tick->userid == 0) {
				$message = $message . lang("email_part16") . '<br /> <a href="'. 
						 site_url("tickets/anon_pro/?ticketid=" . $tick->ID .
						  "&email=" . $tick->email . "&pass=" . $tick->password) . '">' 
						 . site_url("tickets/anon_pro/?ticketid=" . $tick->ID .
						  "&email=" . $tick->email . "&pass=" . $tick->password) . '</a><br /><br />';
			}
			$message = $message .lang("email_part5")
			.$this->settings->info->site_name;

			$this->email->subject('Ticket Response #'.$r->ID);
			$this->email->message($message);

			$this->email->send();
			
			$this->ticket_model->addAgentLog($this->user->info->ID, 
				"{$this->user->info->name} replied to ticket #$ticketid",
				$ticketid);
		} else {
			// Email Staff 
  			if($this->settings->info->alert_support_staff) {
  				$this->load->model("admin_model");
  				$agents = $this->admin_model->getAgents();
  				foreach($agents->result() as $rr) {
  					$this->email->from($this->settings->info->support_email,
					 $this->settings->info->site_name);
					$this->email->to($rr->email);

					$this->email->subject(lang("email_part12") . '(#'.$ticketid.')');
					$this->email->message('Dear '.$rr->name.',<br /><br />
						'.lang("email_part13")
						.$ticketid.'. '.lang("email_part14").
						' <a href="' . site_url().'">' . site_url() . '</a>.');

					$this->email->send();
  				}
  			}
		}

		$this->ticket_model->increaseTicketResponses($this->user->info->ID);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p35"));
		redirect(site_url("tickets/view/" . $r->ID));

	}

	public function close($ticketid, $hash) 
	{
		if ($hash != $this->security->get_csrf_hash()) {
			$this->template->error(lang("error_msg_token"));
		}
		$ticketid = intval($ticketid);

		$this->anon_access($ticketid);

		if (isset($_SESSION['tid']) && $_SESSION['tid'] >0) {
			$ticket = $this->ticket_model->getTicket($ticketid);
			$userid = 0;
		} elseif ($this->user->loggedin) {
			if ($this->user->info->access_level > 0) {
				$ticket = $this->ticket_model->getTicket($ticketid);
			} else {
				$ticket = $this->ticket_model->getTicket(
					$ticketid, $this->user->info->ID);
			}
		}

		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik11"));
		}
		$r = $ticket->row();
		if ($r->status == 2) {
			$this->template->error(lang("error_msg_tik17"));
		}

		// Close
		if($this->user->loggedin) {
			$this->ticket_model->closeTicket($ticketid, $this->user->info->ID);
		} else {
			$this->ticket_model->closeTicket($ticketid, 0);
		}
		$this->session->set_flashdata("globalmsg", lang("flash_data_p36"));
		redirect(site_url("tickets/view/" . $r->ID));
	}

	public function priority($ticketid, $type, $hash) 
	{
		if ($hash != $this->security->get_csrf_hash()) {
			$this->template->error(lang("error_msg_token"));
		}
		$ticketid = intval($ticketid);

		$this->anon_access($ticketid);

		if (isset($_SESSION['tid']) && $_SESSION['tid'] >0) {
			$ticket = $this->ticket_model->getTicket($ticketid);
			$userid = 0;
		} elseif ($this->user->loggedin) {
			if ($this->user->info->access_level > 0) {
				$ticket = $this->ticket_model->getTicket($ticketid);
			} else {
				$ticket = $this->ticket_model->getTicket(
					$ticketid, $this->user->info->ID);
			}
		}

		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik11"));
		}
		$r = $ticket->row();
		if ($r->status == 2) {
			$this->template->error(lang("error_msg_tik17"));
		}

		if ($type == 1) {
			if ($r->priority >= 3) {
				$this->template->error(lang("error_msg_tik18"));
			}
			$this->ticket_model->increaseTicketPriority($ticketid);
		} else {
			if ($r->priority <=0) $this->template->error(lang("error_msg_tik19"));
			$this->ticket_model->decreaseTicketPriority($ticketid);
		}
		$this->session->set_flashdata("globalmsg", lang("flash_data_p37"));
		redirect(site_url("tickets/view/" . $r->ID));
	}

	public function notes($ticketid) {
		$ticketid = intval($ticketid);
		if (!$this->user->loggedin) {
			$this->template->error(lang("error_msg_login"));
		}
		if ($this->user->info->access_level <=0) {
			$this->template->error(lang("error_msg_access"));
		}

		$ticket = $this->ticket_model->getTicket($ticketid);
		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik11"));
		}

		$this->template->loadContent("ticket/notes.php", 
			array(
				"ticket" => $ticket->row()
			)
		);

	}

	public function notes_pro($ticketid) {
		$ticketid = intval($ticketid);
		if (!$this->user->loggedin) {
			$this->template->error(lang("error_msg_login"));
		}
		if ($this->user->info->access_level <=0) {
			$this->template->error(lang("error_msg_access"));
		}
		$ticket = $this->ticket_model->getTicket($ticketid);
		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik11"));
		}
		$notes = $this->lib_filter->removeHTML($this->input->post("notes"));
		$this->ticket_model->update_notes($ticketid, $notes);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p38"));
		redirect(site_url("tickets/view/" . $ticketid));
	}

	private function anon_access($ticketid) 
	{
		// Check anon ticket access
		if (isset($_SESSION['tid']) && $_SESSION['tid'] > 0) {
			if ($ticketid != $_SESSION['tid']) {
				$this->template->error(lang("error_msg_tik20"));
			}
			if ($_SESSION['cod'] != md5("blowfish28273273_" . $ticketid)) {
				$this->template->error(lang("error_msg_tik20"));
			}
			if (!$this->settings->info->guest_enable) {
				$this->template->error(lang("error_msg_tik21"));
			}
		}
	}

	public function edit_ticket($id) 
	{
		$this->template->loadExternal('<script type="text/javascript" src="
			'.base_url().'scripts/ticket.js" /></script><script src="'.base_url()
			.'scripts/tinymce/tinymce.min.js"></script>
			<script src="'.base_url().'scripts/tinymce/config.js"></script>');
		$id = intval($id);
		$ticket = $this->ticket_model->get_ticket_reply($id);
		if($ticket->num_rows() == 0) $this->template->error(lang("error_msg_1"));

		$ticket = $ticket->row();
		$flag = 0;

		if($this->user->loggedin) {
			if($ticket->userid == $this->user->info->ID) {
				$flag = 2;
			}
			if($this->user->info->access_level > 0) {
				$flag = 2;
			}
		} else {
			if (isset($_SESSION['tid']) && $_SESSION['tid'] >0) {
				$ticketid = intval($_SESSION['tid']);
				$ticketi = $this->ticket_model->getTicket($ticketid);
				if($ticketi->num_rows() == 0) {
					$this->template->error(lang("error_msg_1"));
				}
				$flag = 2;
			}
		}

		if($flag != 2) $this->template->error(lang("error_msg_2"));

		$this->template->loadContent("ticket/edit.php", 
			array(
				"ticket" => $ticket
			)
		);
	}

	public function edit_ticket_pro($id) 
	{
		$id = intval($id);
		$ticket = $this->ticket_model->get_ticket_reply($id);
		if($ticket->num_rows() == 0) $this->template->error(lang("error_msg_1"));

		$ticket = $ticket->row();
		$flag = 0;

		if($this->user->loggedin) {
			if($ticket->userid == $this->user->info->ID) {
				$flag = 2;
			}
			if($this->user->info->access_level > 0) {
				$flag = 2;
			}
		} else {
			if (isset($_SESSION['tid']) && $_SESSION['tid'] >0) {
				$ticketid = intval($_SESSION['tid']);
				$ticketi = $this->ticket_model->getTicket($ticketid);
				if($ticketi->num_rows() == 0) {
					$this->template->error(lang("error_msg_1"));
				}
				$flag = 2;
			}
		}

		if($flag != 2) $this->template->error(lang("error_msg_2"));

		$reply = $this->lib_filter->go(
			$this->input->post("ticket_reply")
		);
		if(empty($reply)) $this->template->error(lang("error_msg_3"));

		$this->ticket_model->update_ticket($id, $reply);
		$this->session->set_flashdata("globalmsg", lang("pg_suc_1"));
		redirect(site_url("tickets/view/" . $ticket->ticketid));

	}

	public function assign($ticketid) 
	{
		$ticketid = intval($ticketid);
		if (!$this->user->loggedin) {
			$this->template->error(lang("error_msg_login"));
		}
		if ($this->user->info->access_level <=0) {
			$this->template->error(lang("error_msg_access"));
		}
		$ticket = $this->ticket_model->getTicket($ticketid);
		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik11"));
		}

		$ticket = $ticket->row();

		$users = array();
		$assigned = explode("***", $ticket->assigned);
		$u = null;
		foreach($assigned as $r) {
			$r = str_replace("U", "", $r);
			$u = $this->ticket_model->get_user($r);
			if($u->num_rows() > 0) {
				$u = $u->row();
				$users[] = $u;
			}
		}

		$staff = $this->ticket_model->get_staff();

		$this->template->loadContent("ticket/assign.php", 
			array(
				"ticket" => $ticket,
				"users" => $users,
				"staff" => $staff
			)
		);

	}

	public function remove_assign($ticketid, $userid, $hash) 
	{
		if($hash != $this->security->get_csrf_hash()) {
			$this->template->error(lang("error_msg_token"));
		}
		$userid = intval($userid);

		$ticketid = intval($ticketid);
		if (!$this->user->loggedin) {
			$this->template->error(lang("error_msg_login"));
		}
		if ($this->user->info->access_level <=0) {
			$this->template->error(lang("error_msg_access"));
		}
		$ticket = $this->ticket_model->getTicket($ticketid);
		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik11"));
		}

		$ticket = $ticket->row();
		$new = array();
		$assigned = explode("***", $ticket->assigned);
		foreach($assigned as $r) {
			$uid = str_replace("U", "", $r);
			if($uid != $userid) {
				$new[] = $r;
			} 
		}
		$new = implode("***", $new);
		$this->ticket_model->update_assigned($new,$ticketid);
		$this->session->set_flashdata("globalmsg", lang("pg_suc_2"));
		redirect(site_url("tickets/assign/" . $ticketid));

	}

	public function assign_ticket($ticketid) {
		$ticketid = intval($ticketid);
		if (!$this->user->loggedin) {
			$this->template->error(lang("error_msg_login"));
		}
		if ($this->user->info->access_level <=0) {
			$this->template->error(lang("error_msg_access"));
		}
		$ticket = $this->ticket_model->getTicket($ticketid);
		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik11"));
		}

		$userid = intval($this->input->post("userid"));

		$ticket = $ticket->row();
		$flag = 0;
		$assigned = explode("***", $ticket->assigned);
		foreach($assigned as $r) {
			$uid = str_replace("U", "", $r);
			if($uid == $userid) {
				$flag = 2;
			} 
		}
		if(!$flag) {
			$assigned[] = "U" . $userid . "U";
		}
		$new = implode("***", $assigned);
		$this->ticket_model->update_assigned($new,$ticketid);
		$this->session->set_flashdata("globalmsg", lang("pg_suc_3"));
		redirect(site_url("tickets/assign/" . $ticketid));
	}


}

?>
