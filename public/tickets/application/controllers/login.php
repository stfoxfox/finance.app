<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller 
{

	public function __construct() 
	{
		parent::__construct();
		$this->load->model("login_model");
		$this->load->model("ip_model");
	}

	public function index()
	{

		if ($this->user->loggedin) {
			$this->template->error(lang("error_msg_login3"));
		}
		$this->template->loadContent("login/index.php", array());
	}

	public function pro() 
	{
		if ($this->user->loggedin) {
			$this->template->error(lang("error_msg_login3"));
		}

		// IP Block check
		if ($this->ip_model->checkIpIsBlocked($_SERVER['REMOTE_ADDR'])) {
			$this->template->error(
				lang("error_msg_ip")
			);
		}
		
		$email = $this->input->post("email", true);
		$pass = $this->input->post("pass", true);
		$remember = $this->input->post("remember", true);

		$login = $this->login_model->getUserByEmail($email);
		if ($login->num_rows() == 0) {
			$this->template->error(lang("error_msg_login4"));
		}
		$r = $login->row();
		$userid = $r->ID;

		$phpass = new PasswordHash(12, false);
    	if (!$phpass->CheckPassword($pass, $r->password)) {
    		$this->template->error(lang("error_msg_login4"));
    	}

		// Generate a token
		$token = rand(1,100000) . $email;
		$token = md5(sha1($token));

		// Store it
		$this->login_model->updateUserToken($userid, $token);

		// Create Cookies
		if ($remember == 1) {
			$ttl = 3600*24*31;
		} else {
			$ttl = 3600;
		}

		// Destroy old session data
		session_destroy();
		$_SESSION['cod'] = "";
		$_SESSION['tid'] = 0;

		setcookie("scun", $email, time()+$ttl, "/");
		setcookie("sctkn", $token, time()+$ttl, "/");

		if($r->access_level <=0) {
			redirect(site_url());
		} else {
			redirect(site_url("agent"));
		}
	}

	public function logout($hash) 
	{
		$this->load->helper("cookie");
		if ($hash != $this->security->get_csrf_hash() ) {
			$this->template->error(lang("error_msg_token"));
		}
		delete_cookie("scun");
		delete_cookie("sctkn");
		redirect(site_url());
	}

	public function resetpw($token,$userid) 
	{
		$userid = intval($userid);
		// Check
		$user = $this->login_model->getResetUser($token, $userid);
		if ($user->num_rows() == 0) {
			$this->template->error(lang("error_msg_request"));
		}

		$r=$user->row();
		if ($r->timestamp +3600*24*7 < time()) {
			$this->template->error(lang("error_msg_request"));
		}

		$this->template->loadContent("login/resetpw.php", 
			array(
				"token" => $token,
				 "userid" => $userid
			)
		);

	}

	public function resetpw_pro($token, $userid) 
	{
		$userid = intval($userid);
		// Check
		$user = $this->login_model->getResetUser($token, $userid);
		if ($user->num_rows() == 0) {
			$this->template->error(lang("error_msg_request"));
		}
		$r=$user->row();
		if ($r->timestamp +3600*24*7 < time()) {
			$this->template->error(lang("error_msg_request"));
		}

		$npassword = $this->lib_filter->removeHTML(
			$this->input->post("npassword", true)
		);
		$npassword2 = $this->lib_filter->removeHTML(
			$this->input->post("npassword2", true)
		);

		if ($npassword != $npassword2) {
			$this->template->error(lang("error_msg_pass"));
		}

		if (empty($npassword)) {
			$this->template->error(lang("error_msg_pass2"));
		}

		$password = $this->common->encrypt($npassword);

		$this->login_model->updatePassword($userid, $password);
		$this->login_model->deleteReset($token);
		$this->session->set_flashdata("globalmsg", lang("flash_data_p23"));
		redirect(site_url("login"));
	}

	public function forgotpw() {
		$this->template->loadContent("login/forgotpw.php", array());
	}

	public function forgotpw_pro() 
	{
		$email = $this->input->post("email", true);

		$log = $this->login_model->getResetLog($_SERVER['REMOTE_ADDR']);
		if ($log->num_rows() > 0) {
			$log = $log->row();
			if ($log->timestamp+ 60*15 > time()) {
				$this->template->error(
					lang("error_msg_request2")
				);
			}
		}

		$this->login_model->addToResetLog($_SERVER['REMOTE_ADDR']);

		// Check for email
		$user = $this->login_model->getUserEmail($email);
		if ($user->num_rows() == 0) {
			$this->template->error(
				lang("error_msg_emailreq")
			);
		}
		$user = $user->row();

		$token = rand(10000000,100000000000000000)
		. "HUFI9e9dvcwjecw8392klle@O(*388*&&£^^$$$";

		$token = sha1(md5($token));

		$this->login_model->resetPW($user->ID, $token);

		// Send Email
		$this->load->library('email');

		$this->email->from($this->settings->info->support_email,
		 $this->settings->info->site_name);
		$this->email->to($email);

		$this->email->subject(
			$this->settings->info->site_name . ' Password Reset ');
		$this->email->message(lang("email_part1") . $user->name . ',
		<br /><br /> '.lang("email_part2").'
		'.$this->settings->info->site_name.' ('.site_url().'). 
		'.lang("email_part3").'
		<a href="'.site_url("login/resetpw/" . $token . "/" . $user->ID).'">
		'.site_url("login/resetpw/" . $token . "/" . $user->ID).'</a>. 
		<br /><br /> '.lang("email_part4").'<br /><br /> '.lang("email_part5")
		.$this->settings->info->site_name);

		$this->email->send();
		$this->session->set_flashdata("globalmsg", lang("flash_data_p24"));
		redirect(site_url("login/forgotpw"));
	}


}

?>
