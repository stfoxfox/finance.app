<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Install extends CI_Controller 
{

	public function __construct() 
	{
		 parent::__construct();
		 $this->load->model("install_model");
	}

	public function index()
	{
		$this->template->loadContent("install/index.php", array());
	}

	public function install_pro() 
	{
		$email = $this->lib_filter->removeHTML($this->input->post("email"));
		$password = $this->lib_filter->removeHTML(
			$this->input->post("password"));
		$password2 = $this->lib_filter->removeHTML(
			$this->input->post("password2"));
		$site_name = $this->lib_filter->removeHTML(
			$this->input->post("site_name"));
		$support_email = $this->lib_filter->removeHTML(
			$this->input->post("support_email")
		);

		if (empty($email)) {
			$this->template->error("You cannot leave your email empty!");
		}
		if (empty($password)) {
			$this->template->error("You cannot leave your password empty!");
		}

		if ($password != $password2) {
			$this->template->error("Passwords do not match.");
		}

		if ($this->install_model->checkAdmin()) {
			$this->template->error(
				"The install file cannot be used as an admin account 
				has already been created."
			);
		}
		
		$this->install_model->createAdmin($email, 
			$this->common->encrypt($password));
		$dir = dirname(__FILE__);
		$dir = substr($dir, 0, strlen($dir) - 23);
		$this->install_model->updateSite($site_name, $support_email, $dir);
		$msg = "You have successfully created your Admin account. ";
		$msg.= "You can now login to the Support Centre. ";
		$msg.= "Please delete the application/controllers/install.php file.";
		$this->session->set_flashdata("globalmsg", $msg);
		redirect(site_url("login"));
	}

}

?>
