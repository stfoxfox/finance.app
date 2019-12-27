<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_Settings extends CI_Controller 
{

	public function __construct() 
	{
		parent::__construct();
		$this->load->model("settings_model");
		$this->load->model("register_model");
		if (!$this->user->loggedin) {
			$this->template->error(
				lang("error_msg_login"));
		}
	}

	public function index() 
	{
		$this->template->loadContent("settings/index.php", array());
	}

	public function update() 
	{
		$this->load->helper('email');
		$email = $this->input->post("email", true);
		$name = $this->lib_filter->removeHTML($this->input->post("name", true));
		$email_notifications = intval($this->input->post("email_notification"));
		$password = $this->input->post("password", true);

		if (($email_notifications < 0) || ($email_notifications > 1)) {
		 $this->template->error(lang("error_msg_inv"));
		}

		if (strlen($name) > 255) {
			$this->template->error(lang("error_msg_reg6"));
		}

		if (empty($email)) {
			$this->template->error(lang("error_msg_reg7"));
		}

		if (!valid_email($email)) {
			$this->template->error(lang("error_msg_reg8"));
		}

		if ($email != $this->user->info->email) {
			if (!$this->register_model->checkEmailIsFree($email)) {
				$this->template->error(
					lang("error_msg_reg9"));
			}
			$email_info = lang("flash_data_p26") . " <a href='".site_url("login")."'>here</a>";
		} else {
			$email_info = "";
		}

		$hash = $this->settings_model->getPassword($this->user->info->ID);
		$phpass = new PasswordHash(12, false);
    	if (!$phpass->CheckPassword($password, $hash)) {
    		$this->template->error(lang("error_msg_pass3"));
    	}

		$this->settings_model->updateUser(
			$this->user->info->ID, $email, $name, $email_notifications);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p27") . $email_info);
		redirect(site_url("user_settings"));
	}

	public function changepw() 
	{
		$this->template->loadContent("settings/changepw.php", array());
	}

	public function changepw_pro($tok) 
	{
		if ($tok != $this->security->get_csrf_hash()) {
			$this->template->error(lang("error_msg_token"));
		}
		$password= $this->lib_filter->removeHTML(
			$this->input->post("password", true));
		$npassword = $this->lib_filter->removeHTML(
			$this->input->post("npassword", true));
		$npassword2 = $this->lib_filter->removeHTML(
			$this->input->post("npassword2", true));

		if ($npassword != $npassword2) {
			$this->template->error(
				lang("error_msg_pass"));
		}
		if (empty($npassword)) {
			$this->template->error(lang("error_msg_pass2"));
		}

		$hash = $this->settings_model->getPassword($this->user->info->ID);
		$phpass = new PasswordHash(12, false);
    	if (!$phpass->CheckPassword($password, $hash)) {
    		$this->template->error(
    			lang("error_msg_pass4"));
    	}

		$this->settings_model->updatePassword(
			$this->user->info->ID, $this->common->encrypt($npassword));
		$this->session->set_flashdata("globalmsg", lang("flash_data_p28"));
		redirect(site_url("user_settings/changepw"));
	}

}

?>
