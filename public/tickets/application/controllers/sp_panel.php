<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class SP_Panel extends CI_Controller 
{

	public function __construct() 
	{
		parent::__construct();
		$this->load->model("admin_model");
		$this->load->model("ticket_model");
		if (!$this->user->loggedin) {
			$this->template->error(lang("error_msg_login"));
		}
		if ($this->user->info->access_level < 2) {
			$this->template->error(lang("error_msg_access"));
		}
	}

	public function index() 
	{
		$this->template->loadContent("sp_panel/index.php", array());
	}

	public function stats() 
	{
		$user_count = $this->admin_model->getUserCount();
		$staff_count = $this->admin_model->getTotalStaff();
		$ticket_count = $this->admin_model->getTotalTickets();
		$ticket_closed_count = $this->admin_model->getTotalTicketsClosed();
		$replies_count = $this->admin_model->getTotalTicketsReply();
		$agent_count = $this->admin_model->getAgentLogCount(0);
		$article_count = $this->admin_model->getArticleCount(0);
		$this->template->loadContent("sp_panel/stats.php", array(
			"user_count" => $user_count,
			"staff_count" => $staff_count,
			"ticket_count" => $ticket_count,
			"ticket_closed_count" => $ticket_closed_count,
			"replies_count" => $replies_count,
			"agent_count" => $agent_count,
			"article_count" => $article_count

			)
		);
	}

	public function add_canned_response() 
	{
		$this->template->loadExternal('</script><script src="'.base_url()
			.'scripts/tinymce/tinymce.min.js"></script>
			<script src="'.base_url().'scripts/tinymce/config.js"></script>');
		$this->template->loadContent("sp_panel/add_canned_response.php", array());
	}

	public function add_canned_response_pro() 
	{
		$title = $this->lib_filter->removeHTML($this->input->post("title"));
		$response = $this->lib_filter->go($this->input->post("response"));

		if (empty($title)) {
			$this->template->error("You cannot leave the title empty!");
		}

		$this->admin_model->add_canned_response($title, $response);
		$this->session->set_flashdata("globalmsg", "You added a new Canned Response!");
		redirect(site_url("sp_panel"));
	}

	public function edit_canned_response() 
	{
		$responses = $this->admin_model->get_canned_responses();
		$this->template->loadContent("sp_panel/edit_canned_response.php", 
			array("responses" => $responses));
	}

	public function delete_canned_response($id,$hash) {
		if($hash != $this->security->get_csrf_hash()) {
			$this->template->error("Invalid Token!");
		}
		$id = intval($id);
		$response = $this->admin_model->get_response($id);
		if($response->num_rows() == 0) {
			$this->template->error("Invalid Response!");
		}
		$this->admin_model->delete_response($id);
		$this->session->set_flashdata("globalmsg", "Deleted Response!");
		redirect(site_url("sp_panel/edit_canned_response"));
	}

	public function edit_canned_response_pro($id) 
	{
		$this->template->loadExternal('</script><script src="'.base_url()
			.'scripts/tinymce/tinymce.min.js"></script>
			<script src="'.base_url().'scripts/tinymce/config.js"></script>');
		$id = intval($id);
		$response = $this->admin_model->get_response($id);
		if($response->num_rows() == 0) {
			$this->template->error("Invalid Response!");
		}
		$this->template->loadContent("sp_panel/edit_canned_response_pro.php", 
			array("response" => $response->row()));
	}

	public function edit_canned_response_pro_pro($id) 
	{
		$id = intval($id);
		$response = $this->admin_model->get_response($id);
		if($response->num_rows() == 0) {
			$this->template->error("Invalid Response!");
		}
		$title = $this->lib_filter->removeHTML($this->input->post("title"));
		$response = $this->lib_filter->go($this->input->post("response"));

		if (empty($title)) {
			$this->template->error("You cannot leave the title empty!");
		}
		$this->admin_model->update_response($id, $title, $response);
		$this->session->set_flashdata("globalmsg", "The Response was updated!");
		redirect(site_url("sp_panel/edit_canned_response"));
	}

	public function add_custom_field() 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		$this->template->loadContent("sp_panel/add_custom_field.php");
	}

	public function add_custom_field_pro() 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		$name = $this->lib_filter->removeHTML($this->input->post("name", true));
		$placeholder = $this->lib_filter->removeHTML(
			$this->input->post("placeholder", true));
		$required = intval($this->input->post("required", true));
		$fieldtype = intval($this->input->post("fieldtype", true));
		$selectoptions = $this->lib_filter->removeHTML(
			$this->input->post("selectoptions", true));
		$helper = $this->lib_filter->removeHTML($this->input->post("helper", true));

		if (($required > 1) || ($required < 0)) {
			$this->template->error(lang("error_msg_ad1"));
		}
		if (($fieldtype < 0) || ($fieldtype > 4)) {
			$this->template->error(lang("error_msg_ad2"));
		}

		if (empty($name)) {
			$this->template->error(lang("error_msg_ad3"));
		}

		// Add
		$this->admin_model->addField(
			array(
				"name" => $name, 
				"placeholder" => $placeholder, 
				"required" => $required, 
				"fieldtype" => $fieldtype, 
				"selectoptions" => $selectoptions, 
				"subtext" => $helper
			)
		);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p1"));
		redirect(site_url("sp_panel"));
	}

	public function edit_custom_fields() 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		$fields = $this->ticket_model->getCustomFields();
		$this->template->loadContent("sp_panel/edit_custom_fields.php", 
			array(
				"fields" => $fields
			)
		);
	}

	public function edit_custom_field_pro($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		$id = intval($id);
		$field = $this->ticket_model->getCustomField($id);
		if ($field->num_rows() == 0) {
			$this->template->error(lang("error_msg_ad4"));
		}

		$name = $this->lib_filter->removeHTML($this->input->post("name", true));
		$placeholder = $this->lib_filter->removeHTML(
			$this->input->post("placeholder", true));
		$required = intval($this->input->post("required", true));
		$fieldtype = intval($this->input->post("fieldtype", true));
		$selectoptions = $this->lib_filter->removeHTML(
			$this->input->post("selectoptions", true));
		$helper = $this->lib_filter->removeHTML(
			$this->input->post("helper", true));

		if (($required > 1) || ($required < 0)) {
			$this->template->error(lang("error_msg_ad1"));
		}
		if (($fieldtype < 0) || ($fieldtype > 4)) {
			$this->template->error(lang("error_msg_ad2"));
		}

		if (empty($name)) {
			$this->template->error(lang("error_msg_ad3"));
		}

		$this->admin_model->updateField($id, 
			array(
				"name" => $name, 
				"placeholder" => $placeholder, 
				"required" => $required, 
				"fieldtype" => $fieldtype, 
				"selectoptions" => $selectoptions, 
				"subtext" => $helper
			)
		);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p2"));
		redirect(site_url("sp_panel"));
	}

	public function edit_custom_field($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		$id = intval($id);
		$field = $this->ticket_model->getCustomField($id);
		if ($field->num_rows() == 0) {
			$this->template->error(lang("error_msg_ad4"));
		}

		$this->template->loadContent("sp_panel/edit_custom_field.php", 
			array(
				"field" => $field->row()
			)
		);
	}

	public function edit_custom_field_delete($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		$id = intval($id);
		$field = $this->ticket_model->getCustomField($id);
		if ($field->num_rows() == 0) {
			$this->template->error(lang("error_msg_ad4"));
		}

		$this->admin_model->deleteCustomField($id);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p3"));
		redirect(site_url("sp_panel/edit_custom_fields"));
	}

	public function create_agent() 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		$categories = $this->ticket_model->getCategories();
		$this->template->loadContent("sp_panel/create_agent.php", 
			array("categories" => $categories));
	}

	public function create_agent_pro() 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		$this->load->helper('email');
		$this->load->model("register_model");
		$this->load->library("upload");

		$email = $this->input->post("email", true);
		$name = $this->lib_filter->removeHTML($this->input->post("name", true));
		$pass = $this->input->post("password", true);
		$accesslevel = intval($this->input->post("access_level", true));
		$catid = intval($this->input->post("catid", true));
		$locked_cat = intval($this->input->post("locked_cat"));

		if (strlen($name) > 255) {
			$this->template->error(lang("error_msg_reg6"));
		}

		if (empty($email)) {
			$this->template->error(lang("error_msg_reg7"));
		}

		if (!valid_email($email)) {
			$this->template->error(lang("error_msg_reg8"));
		}

		if (!$this->register_model->checkEmailIsFree($email)) {
			$this->template->error(lang("error_msg_reg9"));
		}

		if (($accesslevel <=0) || ($accesslevel> 4)) {
			$this->template->error(lang("error_msg_ad5"));
		}

		$pass = $this->common->encrypt($pass);

		if ($_FILES['userfile']['size'] > 0) {
			$this->upload->initialize(array( 
		       "upload_path" => $this->settings->info->upload_path,
		       "overwrite" => FALSE,
		       "max_filename" => 300,
		       "encrypt_name" => TRUE,
		       "remove_spaces" => TRUE,
		       "allowed_types" => "gif|jpg|png|jpeg|",
		       "max_size" => 300,
		       "xss_clean" => TRUE
		    ));

		    if (!$this->upload->do_upload()) {
		    	$this->template->error("Upload Error: "
		    	.$this->upload->display_errors());
		    }

		    $data = $this->upload->data();

		    $image = $data['file_name'];
		} else {
			$image="";
		}


		$this->register_model->registerUser(
			$email, $name, $pass, "Admin Created", $accesslevel,
			$image, $catid, $locked_cat
		);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p4"));
		redirect(site_url("sp_panel/edit_agent"));

	}

	public function edit_agent() 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		$agents = $this->admin_model->getAgents();
		$this->template->loadContent("sp_panel/edit_agent.php", 
			array("agents" => $agents));
	}

	public function edit_agent_pro($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		$id = intval($id);
		$agent = $this->admin_model->getAgent($id);
		if ($agent->num_rows() == 0) $this->template->error(lang("error_msg_ad6"));
		$categories = $this->ticket_model->getCategories();
		$this->template->loadContent("sp_panel/edit_agent_pro.php", 
			array("agent" => $agent->row(), "categories" => $categories));
	}

	public function edit_agent_pro_pro($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		$id = intval($id);
		$agent = $this->admin_model->getAgent($id);
		if ($agent->num_rows() == 0) $this->template->error(lang("error_msg_ad6"));
		$agent = $agent->row();
		$this->load->helper('email');
		$this->load->model("register_model");
		$this->load->library("upload");

		$email = $this->input->post("email", true);
		$name = $this->lib_filter->removeHTML($this->input->post("name", true));
		$pass = $this->input->post("password", true);
		$accesslevel = intval($this->input->post("access_level", true));
		$catid = intval($this->input->post("catid", true));
		$locked_cat = intval($this->input->post("locked_cat"));

		if (strlen($name) > 255) {
			$this->template->error(lang("error_msg_reg6"));
		}

		if (empty($email)) {
			$this->template->error(lang("error_msg_reg7"));
		}

		if (!valid_email($email)) {
			$this->template->error(lang("error_msg_reg8"));
		}

		if($email != $agent->email) {
			if (!$this->register_model->checkEmailIsFree($email)) {
				$this->template->error(lang("error_msg_reg9"));
			}
		}

		if (($accesslevel <=0) || ($accesslevel> 4)) {
			$this->template->error(lang("error_msg_ad5"));
		}

		if (!empty($pass)) {
			$pass = $this->common->encrypt($pass); 
		} else {
			$pass = $agent->password;
		}

		if ($_FILES['userfile']['size'] > 0) {
			$this->upload->initialize(array( 
		       "upload_path" => $this->settings->info->upload_path,
		       "overwrite" => FALSE,
		       "max_filename" => 300,
		       "encrypt_name" => TRUE,
		       "remove_spaces" => TRUE,
		       "allowed_types" => "gif|jpg|png|jpeg|",
		       "max_size" => 300,
		       "xss_clean" => TRUE
		    ));

		    if (!$this->upload->do_upload()) {
		    	$this->template->error("Upload Error: " 
		    	.$this->upload->display_errors());
		    }

		    $data = $this->upload->data();

		    $image = $data['file_name'];
		} else {
			$image= $agent->bio_pic;
		}

		$this->admin_model->updateAgent(
			$id, $name, $email, $pass, $accesslevel, $image, $catid, $locked_cat
		);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p5"));
		redirect(site_url("sp_panel/edit_agent"));
	}

	public function deactivate_agent($id, $hash) 
	{
		$this->common->checkAccess($this->user->info->access_level, 4);
		if ($hash != $this->security->get_csrf_hash()) {
			$this->template->error(lang("error_msg_token"));
		}
		$id = intval($id);
		$agent = $this->admin_model->getAgent($id);
		if ($agent->num_rows() == 0) $this->template->error(lang("error_msg_ad6"));

		$this->admin_model->deactivateAgent($id);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p6"));
		redirect(site_url("sp_panel/edit_agent"));
	}

	public function agent_log($userid = 0, $page=0) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$userid = intval($userid);
		$page = intval($page);
		$logs = $this->admin_model->getAgentLog($userid, $page);

		$this->load->library('pagination');

		$config['base_url'] = site_url("sp_panel/agent_log/" . $userid . "/");
		$config['total_rows'] = $this->admin_model
		->getAgentLogCount($userid);
		$config['per_page'] = 20;
		$config['uri_segment'] = 4;

		$this->pagination->initialize($config); 

		$this->template->loadContent("sp_panel/agent_log.php", 
			array("logs" => $logs));
	}

	public function settings() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$this->template->loadContent("sp_panel/settings.php");
	}

	public function settings_pro() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$this->load->library("upload");
		$site_name = $this->lib_filter->removeHTML(
			$this->input->post("site_name", true));
		$site_desc = $this->lib_filter->removeHTML(
			$this->input->post("site_desc", true));
		$upload_path = $this->lib_filter->removeHTML(
			$this->input->post("upload_path", true));
		$upload_path_relative = $this->lib_filter->removeHTML(
			$this->input->post("upload_path_relative", true));
		$envato_api_key = $this->lib_filter->removeHTML(
			$this->input->post("envato_api_key", true));
		$envato_api_username = $this->lib_filter->removeHTML(
			$this->input->post("envato_api_username", true));
		$guest_enable = intval($this->input->post("guest_enable", true));
		$file_enable = intval($this->input->post("file_enable", true));
		$ticket_rating = intval($this->input->post("ticket_rating", true));
		$support_email = $this->input->post("support_email", true);
		$alert_support_staff = intval($this->input->post("alert_support_staff"));
		$register = intval($this->input->post("register"));
		$disable_captcha = intval($this->input->post("disable_captcha"));

		$this->load->helper('email');
		if (!valid_email($support_email)) {
			$this->template->error(lang("error_msg_reg8"));
		}

		if (($guest_enable > 1) || ($guest_enable < 0)) {
			$this->template->error(lang("error_msg_ad7"));
		}
		if (empty($site_name)) {
			$this->template->error(lang("error_msg_ad8"));
		}

		if ($_FILES['userfile']['size'] > 0) {
			$this->upload->initialize(array( 
		       "upload_path" => $this->settings->info->upload_path,
		       "overwrite" => FALSE,
		       "max_filename" => 300,
		       "encrypt_name" => TRUE,
		       "remove_spaces" => TRUE,
		       "allowed_types" => "gif|jpg|png|jpeg|",
		       "max_size" => 300,
		       "xss_clean" => TRUE
		    ));

		    if (!$this->upload->do_upload()) {
		    	$this->template->error("Upload Error: " 
		    	.$this->upload->display_errors());
		    }

		    $data = $this->upload->data();

		    $image = $data['file_name'];
		} else {
			$image= $this->settings->info->site_logo;
		}

		$this->admin_model->updateSettings(
			array(
				"site_name" => $site_name, 
				"upload_path" => $upload_path, 
				"envato_api_key" => $envato_api_key, 
				"envato_api_username" => $envato_api_username, 
				"upload_path_relative" => $upload_path_relative, 
				"guest_enable" => $guest_enable, 
				"file_enable" => $file_enable, 
				"site_logo"=> $image, 
				"site_desc" => $site_desc, 
				"ticket_rating" => $ticket_rating, 
				"support_email" => $support_email,
				"alert_support_staff" => $alert_support_staff,
				"register" => $register,
				"disable_captcha" => $disable_captcha
			)
		);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p7"));
		redirect(site_url("sp_panel/settings"));
	}

	public function knowledge() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$this->template->loadContent("sp_panel/knowledge.php");
	}

	public function knowledge_update() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$article_voting = intval($this->input->post("article_voting", true));
		$kb_login = intval($this->input->post("kb_login"));
		$disable_seo = intval($this->input->post("disable_seo"));
		$this->admin_model->updateKnowledgeSettings($article_voting, $kb_login, $disable_seo);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p7"));
		redirect(site_url("sp_panel/knowledge"));
	}

	public function twitter() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$this->template->loadContent("sp_panel/twitter.php");
	}

	public function twitter_update() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$twitter_name = $this->lib_filter->removeHTML(
			$this->input->post("twitter_name", true));
		$twitter_display_limit = intval(
			$this->input->post("twitter_display_limit", true));
		$twitter_consumer_key = $this->lib_filter->removeHTML(
			$this->input->post("twitter_consumer_key", true));
		$twitter_consumer_secret = $this->lib_filter->removeHTML(
			$this->input->post("twitter_consumer_secret", true));
		$twitter_access_token = $this->lib_filter->removeHTML(
			$this->input->post("twitter_access_token", true));
		$twitter_access_secret = $this->lib_filter->removeHTML(
			$this->input->post("twitter_access_secret", true));
		$update_tweets = intval($this->input->post("update_tweets"));

		$this->admin_model->updateTwitterSettings(
			array(
				"twitter_name" => $twitter_name, 
				"twitter_display_limit" => $twitter_display_limit,
				"twitter_consumer_key" => $twitter_consumer_key,
				"twitter_consumer_secret" => $twitter_consumer_secret,
				"twitter_access_token" => $twitter_access_token,
				"twitter_access_secret" => $twitter_access_secret,
				"update_tweets" => $update_tweets
			)
		);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p7"));
		redirect(site_url("sp_panel/twitter"));
	}

	public function edit_user($page=0) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$page = intval($page);
		$users = $this->admin_model->getUsers($page);
		$this->load->library('pagination');

		$config['base_url'] = site_url("sp_panel/edit_user/");
		$config['total_rows'] = $this->admin_model->getUserCount();
		$config['per_page'] = 20;

		$this->pagination->initialize($config); 

		$this->template->loadContent("sp_panel/edit_user.php", 
			array("users" => $users));
	}

	public function edit_user_pro($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$id = intval($id);
		$agent = $this->admin_model->getUser($id);
		if ($agent->num_rows() == 0) $this->template->error(lang("error_msg_ad9"));

		$this->template->loadContent("sp_panel/edit_user_pro.php", 
			array("agent" => $agent->row()));
	}

	public function search_user($search_g='', $type_g=0, $page=0) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$search = $this->lib_filter->removeHTML(
			$this->input->post("search_term", true));
		$type = intval($this->input->post("type", true));

		if (!empty($search_g)) {
			$search = $this->lib_filter->removeHTML($search_g);
			$type = intval($type_g);
		}

		if (empty($search)) {
			$this->template->error(lang("error_msg_ad10"));
		}

		if ($type == 0) {
			// Search by name
		} elseif ($type == 1) {
			// Search by email
		} elseif ($type == 2) {
			// Search by IP
		} else {
			$this->template->error(lang("error_msg_ad11"));
		}

		$page = intval($page);
		$users = $this->admin_model->getUsersSearch($search, $type, $page);

		$this->load->library('pagination');

		$config['base_url'] = site_url("sp_panel/search_user/" 
		. $search . "/" . $type . "/");
		$config['total_rows'] = 
			$this->admin_model->getUserCountSearch($search, $type);
		$config['per_page'] = 20;

		$this->pagination->initialize($config);

		$this->template->loadContent("sp_panel/search_user.php", 
			array(
				"users" => $users,
				"search" => $search,
				"type" => $type
			)
		);
	}

	public function edit_user_pro_pro($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$id = intval($id);
		$agent = $this->admin_model->getUser($id);
		if ($agent->num_rows() == 0) $this->template->error(lang("error_msg_ad9"));
		$agent = $agent->row();
		$this->load->helper('email');
		$this->load->model("register_model");

		$email = $this->input->post("email", true);
		$name = $this->lib_filter->removeHTML($this->input->post("name", true));
		$pass = $this->input->post("password", true);
		$accesslevel = intval($this->input->post("access_level", true));

		if (strlen($name) > 255) {
			$this->template->error(lang("error_msg_reg6"));
		}

		if (empty($email)) {
			$this->template->error(lang("error_msg_reg7"));
		}

		if (!valid_email($email)) {
			$this->template->error(lang("error_msg_reg8"));
		}

		if($email != $agent->email) {
			if (!$this->register_model->checkEmailIsFree($email)) {
				$this->template->error(lang("error_msg_reg9"));
			}
		}

		if (($accesslevel <-2) || ($accesslevel> 4)) {
			$this->template->error(lang("error_msg_ad5"));
		}

		if (!empty($pass)) {
			$pass = $this->common->encrypt($pass); 
		} else {
			$pass = $agent->password;
		}

		$this->admin_model
			 ->updateUser($id, $name, $email, $pass, $accesslevel);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p8"));
		redirect(site_url("sp_panel/edit_user"));
	}

	public function ban_user($userid, $hash) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		if ($hash != $this->security->get_csrf_hash()) {
			$this->template->error(lang("error_msg_token"));
		}
		$id = intval($userid);
		$agent = $this->admin_model->getUser($id);
		if ($agent->num_rows() == 0) $this->template->error(lang("error_msg_ad9"));

		$this->admin_model->banUser($id);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p9"));
		redirect(site_url("sp_panel/edit_user"));
	}

	public function delete_user($userid, $hash) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		if ($hash != $this->security->get_csrf_hash()) {
			$this->template->error(lang("error_msg_token"));
		}
		$id = intval($userid);
		$agent = $this->admin_model->getUser($id);
		if ($agent->num_rows() == 0) $this->template->error(lang("error_msg_ad9"));

		$this->admin_model->deleteUser($id);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p10"));
		redirect(site_url("sp_panel/edit_user"));
	}

	public function delete_ip($id,$hash) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		if ($hash != $this->security->get_csrf_hash()) { 
			$this->template->error(lang("error_msg_token"));
		}
		$id = intval($id);
		$this->admin_model->deleteIp($id);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p11"));
		redirect(site_url("sp_panel/ip_blocking"));
	}

	public function ip_blocking($page=0) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$ip = $this->admin_model->getIps($page);

		$this->load->library('pagination');

		$config['base_url'] = site_url("sp_panel/ip_blocking/");
		$config['total_rows'] = $this->admin_model->getIpCount();
		$config['per_page'] = 20;

		$this->pagination->initialize($config); 

		$this->template->loadContent("sp_panel/edit_ip.php", 
			array("ips" => $ip));
	}

	public function block_ip() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$ip = $this->lib_filter->removeHTML($this->input->post("ip", true));
		$reason = $this->lib_filter->removeHTML(
			$this->input->post("reason", true));
		if (empty($ip)) {
			$this->template->error(lang("error_msg_ad12"));
		}

		$this->admin_model->blockIp($ip, $reason);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p12"));
		redirect(site_url("sp_panel/ip_blocking"));
	}

	public function add_article() 
	{
		$this->common->checkAccess($this->user->info->access_level, 2);
		$this->template->loadExternal(
			"<script src='".base_url()
			."scripts/tinymce/tinymce.min.js'></script>
			<script src='".base_url()."scripts/tinymce/config.js'></script>");
		$categories = $this->admin_model->getArticleCategories();
		$this->template->loadContent("sp_panel/add_article.php", 
			array("categories" => $categories));
	}

	public function add_article_pro() 
	{
		$this->common->checkAccess($this->user->info->access_level, 2);
		$title = $this->lib_filter->removeHTML($this->input->post("title", true));
		if(!$this->settings->info->disable_seo) {
			if(!preg_match("/^[a-z0-9_ ]+$/i", $title)) $this->template->error(lang("error_msg_5"));
		}
		$catid = intval($this->input->post("catid"));
		$content = $this->lib_filter->go($this->input->post("article_content"));

		$category = $this->admin_model->getArticleCategory($catid);
		if ($category->num_rows() == 0) {
			$this->template->error(lang("error_msg_ad13"));
		}
		$r=$category->row();

		if (empty($title)) $this->template->error(lang("error_msg_ad14"));

		$this->admin_model->addArticle(
			$title, $catid, $content, $this->user->info->ID);
		$this->admin_model->updateCategoryCount($catid, $r->article_count+1);

		$this->session->set_flashdata("globalmsg", lang("flash_data_p13"));
		redirect(site_url("sp_panel"));
	}

	public function edit_article($catid=0, $limit=0) 
	{
		$this->common->checkAccess($this->user->info->access_level, 2);
		$limit = intval($limit);
		$catid = intval($catid);
		$articles = $this->admin_model->getArticles($catid, $limit);

		$this->load->library('pagination');

		$config['base_url'] = site_url("sp_panel/edit_article/" . $catid . "/");
		$config['total_rows'] = $this->admin_model->getArticleCount($catid);
		$config['per_page'] = 20;
		$config['uri_segment'] = 4;

		$this->pagination->initialize($config); 
		$categories = $this->admin_model->getArticleCategories();
		$this->template->loadContent("sp_panel/edit_article.php", 
			array("articles" => $articles,
				"categories" => $categories));
	}

	public function edit_article_pro($id) 
	{
		$this->template->loadExternal("<script src='".base_url()
			."scripts/tinymce/tinymce.min.js'></script>
			<script src='".base_url()."scripts/tinymce/config.js'></script>");
		$id = intval($id);
		$this->common->checkAccess($this->user->info->access_level, 2);
		$article = $this->admin_model->getArticle($id);
		if ($article->num_rows() == 0) {
			$this->template->error(lang("error_msg_ad15"));
		}

		$categories = $this->admin_model->getArticleCategories();

		$this->template->loadContent("sp_panel/edit_article_pro.php", 
			array("article" => $article->row(), "categories" => $categories));
	}

	public function edit_article_pro_pro($id) 
	{
		$id = intval($id);
		$this->common->checkAccess($this->user->info->access_level, 2);
		$article = $this->admin_model->getArticle($id);
		if ($article->num_rows() == 0) {
			$this->template->error(lang("error_msg_ad15"));
		}
		$art = $article->row();

		$title = $this->lib_filter->removeHTML(
			$this->input->post("title", true));
		if(!$this->settings->info->disable_seo) {
			if(!preg_match("/^[a-z0-9_ ]+$/i", $title)) $this->template->error(lang("error_msg_5"));
		}
		$catid = intval($this->input->post("catid"));
		$content = $this->lib_filter->go($this->input->post("article_content"));

		$category = $this->admin_model->getArticleCategory($catid);
		if ($category->num_rows() == 0) {
			$this->template->error(lang("error_msg_ad13"));
		}
		$r=$category->row();

		if (empty($title)) $this->template->error(lang("error_msg_ad14"));
		$this->admin_model->updateArticle($id, $title, $catid, $content);
		if ($art->catid != $catid) {
			// Update both
			$this->admin_model->updateCategoryCount(
				$art->catid, $art->article_count-1);
			$this->admin_model->updateCategoryCount(
				$catid, $r->article_count+1);
		}

		$this->session->set_flashdata("globalmsg", lang("flash_data_p14"));
		redirect(site_url("sp_panel/edit_article"));
	}

	public function delete_article($id) 
	{
		$id = intval($id);
		$this->common->checkAccess($this->user->info->access_level, 2);

		$article = $this->admin_model->getArticle($id);
		if ($article->num_rows() == 0) {
			$this->template->error(lang("error_msg_ad15"));
		}
		$r = $article->row();

		$this->admin_model->deleteArticle($id);
		$this->admin_model->updateCategoryCount(
			$r->catid, $r->article_count-1);

		$this->session->set_flashdata("globalmsg", lang("flash_data_p15"));
		redirect(site_url("sp_panel/edit_article"));
	}

	public function add_category() 
	{
		$this->common->checkAccess($this->user->info->access_level, 2);
		$this->template->loadContent("sp_panel/add_article_category.php", 
			array());
	}

	public function add_category_pro() 
	{
		$this->common->checkAccess($this->user->info->access_level, 2);
		$title = $this->lib_filter->removeHTML(
			$this->input->post("title", true));
		if(!$this->settings->info->disable_seo) {
			if(!preg_match("/^[a-z0-9_ ]+$/i", $title)) $this->template->error(lang("error_msg_5"));
		}
		$desc = $this->lib_filter->removeHTML(
			$this->input->post("desc", true));

		if (empty($title)) {
			$this->template->error(lang("error_msg_ad16"));
		}
		$this->admin_model->addCategory($title, $desc);

		$this->session->set_flashdata("globalmsg", lang("flash_data_p16"));
		redirect(site_url("sp_panel"));
	}

	public function edit_category() 
	{
		$this->common->checkAccess($this->user->info->access_level, 2);
		$categories = $this->admin_model->getArticleCategories();

		$this->template->loadContent("sp_panel/edit_category.php", 
			array("categories" => $categories));

	}

	public function edit_category_pro($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 2);
		$id = intval($id);
		$category = $this->admin_model->getArticleCategory($id);
		if ($category->num_rows() == 0) {
			$this->template->error(lang("error_msg_ad13"));
		}
		$r=$category->row();

		$this->template->loadContent("sp_panel/edit_category_pro.php", 
			array("category" => $r));
	}

	public function edit_category_pro_pro($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 2);
		$id = intval($id);
		$category = $this->admin_model->getArticleCategory($id);
		if ($category->num_rows() == 0) {
			$this->template->error(lang("error_msg_ad13"));
		}
		$r=$category->row();

		$title = $this->lib_filter->removeHTML($this->input->post("title", true));
		if(!$this->settings->info->disable_seo) {
			if(!preg_match("/^[a-z0-9_ ]+$/i", $title)) $this->template->error(lang("error_msg_5"));
		}
		$desc = $this->lib_filter->removeHTML($this->input->post("desc", true));

		$this->admin_model->updateCategory($id,$title,$desc);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p17"));

		redirect(site_url("sp_panel/edit_category"));
	}

	public function delete_category($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 2);
		$id = intval($id);
		$category = $this->admin_model->getArticleCategory($id);
		if ($category->num_rows() == 0) {
			$this->template->error(lang("error_msg_ad13"));
		}
		$r=$category->row();

		$this->admin_model->deleteCategory($id);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p18"));

		redirect(site_url("sp_panel/edit_category"));
	}

	public function view_ratings($limit=0) 
	{
		$this->common->checkAccess($this->user->info->access_level, 2);
		$limit = intval($limit);
		$ratings = $this->admin_model->getRatings($limit);

		$this->load->library('pagination');

		$config['base_url'] = site_url("sp_panel/view_ratings/");
		$config['total_rows'] = $this->admin_model->getRatingCount();
		$config['per_page'] = 20;

		$this->pagination->initialize($config); 

		$this->template->loadContent("sp_panel/ratings.php", 
			array("ratings" => $ratings));
	}

	public function add_ticket_category() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$this->template->loadContent("sp_panel/add_ticket_category.php", 
			array());
	}

	public function add_ticket_category_pro() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$name = $this->lib_filter->removeHTML($this->input->post("name", true));

		if (empty($name)) {
			$this->template->error(lang("error_msg_ad16"));
		}

		$this->admin_model->addTicketCategory($name);
		$this->session->set_flashdata("globalmsg",lang("flash_data_p19"));
		redirect(site_url("sp_panel/edit_ticket_category"));
	}

	public function edit_ticket_category() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$categories = $this->ticket_model->getCategories();
		$this->template->loadContent("sp_panel/edit_ticket_category.php", 
			array("categories" => $categories));
	}

	public function edit_ticket_category_pro($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$id = intval($id);
		$ticket = $this->ticket_model->getCategory($id);
		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik5"));
		}
		$r= $ticket->row();
		$this->template->loadContent("sp_panel/edit_ticket_category_pro.php", 
			array("info" => $r));
	}

	public function edit_ticket_category_pro_pro($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$id = intval($id);
		$ticket = $this->ticket_model->getCategory($id);
		if ($ticket->num_rows() == 0) {
			$this->template->error(lang("error_msg_tik5"));
		}
		$name = $this->lib_filter->removeHTML($this->input->post("name", true));

		if (empty($name)) {
			$this->template->error(lang("error_msg_ad16")); 
		}

		$this->admin_model->updateTicketCategory($name, $id);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p20"));
		redirect(site_url("sp_panel/edit_ticket_category"));

	}

	public function delete_ticket_category($id) 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$id = intval($id);
		$this->admin_model->deleteTicketCategory($id);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p21"));
		redirect(site_url("sp_panel/edit_ticket_category"));
	}

	public function custom_css() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$this->template->loadContent("sp_panel/custom_css.php", array());
	}

	public function custom_css_pro() 
	{
		$this->common->checkAccess($this->user->info->access_level, 3);
		$css = $this->lib_filter->removeHTML($this->input->post("css", true));
		$this->admin_model->updateCSS($css);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p22"));
		redirect(site_url("sp_panel/custom_css"));
	}

}

?>
