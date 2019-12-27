<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Register extends CI_Controller 
{

	public function __construct() 
	{
		parent::__construct();
		$this->load->model("register_model");
		$this->load->model("ip_model");
	}

	public function index()
	{
		if($this->settings->info->register) {
			$this->template->error(lang("error_msg_reg_closed"));
		}
		// IP Block check
		if ($this->ip_model->checkIpIsBlocked($_SERVER['REMOTE_ADDR'])) {
			$this->template->error(
				lang("error_msg_ip")
			);
		}
		if ($this->user->loggedin) {
			$this->template->error(
				lang("error_msg_login5")
			);
		}
		$this->load->helper('email');

		if (isset($_POST['email'])) {
			$email = $this->input->post("email", true);
			$name = $this->lib_filter->removeHTML(
				$this->input->post("name", true));
			$pass = $this->lib_filter->removeHTML(
				$this->input->post("pass1", true));
			$pass2 = $this->lib_filter->removeHTML(
				$this->input->post("pass2", true));
			$year = intval($this->input->post("year", true));
			$month = intval($this->input->post("month", true));
			$day = intval($this->input->post("day", true));
			$tou = intval($this->input->post("tou", true));

			if(!$this->settings->info->disable_captcha) {
				$captcha = $this->input->post("captcha", true);
				if ($captcha != $_SESSION['sc']) {
					$fail = lang("error_msg_reg1");
				}
			}

			$fail = "";
			if ($pass != $pass2) $fail = lang("error_msg_reg2");

			if ($year < date("Y") - 100) $fail = lang("error_msg_reg3");
			if ($month <= 0 || $month > 12) $fail = lang("error_msg_reg3");
			if ($day <= 0 || $day > 31) $fail = lang("error_msg_reg3");

			if ($tou != 1) {
				$fail = lang("error_msg_reg4");
			}

			if (strlen($pass) <= 5) {
				$fail = lang("error_msg_reg5");
			}

			if (strlen($name) > 255) {
				$fail = lang("error_msg_reg6");
			}

			if (empty($email)) {
				$fail = lang("error_msg_reg7");
			}

			if (!valid_email($email)) {
				$fail = lang("error_msg_reg8");
			}

			if (!$this->register_model->checkEmailIsFree($email)) {
				$fail = lang("error_msg_reg9");
			}

			if (strlen($month) === 1) {
				$month = "0" . $month;
			}

			if (strlen($day) === 1) {
				$day = "0" . $day;
			}
			$dob = $year . "/" . $month . "/" . $day;

			if (empty($fail)) {
				// Passed all checks
				$pass = $this->common->encrypt($pass);
				$this->register_model->registerUser(
					$email, $name, $pass, $dob
				);
				$this->session->set_flashdata("globalmsg", lang("flash_data_p25"));
				redirect(site_url("login"));
			}



		}

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

		if (!empty($fail)) {
			$this->template->loadContent("register/index.php", 
				array(
					"email" => $email,
					"cap" => $cap, 
					"name" => $name, 
					"year" => $year, 
					"month" => $month, 
					"day" => $day, 
					"tou" => $tou, 
					"fail" => $fail
				)
			);
		} else {
			$this->template->loadContent("register/index.php", 
				array(
					"cap" => $cap,
					"year" => 2014,
					"month" => 1,
					"day" => 1
				)
			);
		}
	}

}

?>
