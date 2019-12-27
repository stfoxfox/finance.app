<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Aboutus extends CI_Controller 
{

	public function __construct() 
	{
		parent::__construct();
		$this->load->model("content_model");
	}

	public function index() 
	{
		$agents = $this->content_model->getStaff();
		$this->template->loadContent("home/aboutus.php", 
			array("agents" => $agents));
	}

}

?>
