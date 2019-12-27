<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Logink extends CI_Controller 
{	
	public $url_login = '/client/login';
	
	public function __construct() 
	{
		parent::__construct();
		$this->load->model("login_model");
		$this->load->model("logink_model");
		$this->load->model("register_model");
		$this->load->model("ip_model");
		$this->load->helper('url');
	}
	
	public function login($uid = null) {
		$admins = array( 71, 76, 142, 161 );
		
		if (!$uid) {
			redirect('/../User/logout');
		}
		
		$DBstruct = $this->load->database('struct', TRUE);
		$query = $DBstruct->query('SELECT * FROM users WHERE MD5(CONCAT("HutQkAi5wnjUqGsYQuDCkL0S9oCIzADogVhaGRrBIpkPYfVx54J0RWWsRDep1x3Lr2s6iEJsC79sIQYw", id)) = "'.$uid.'"');
		
		if($query->num_rows() > 0) {
			$data = json_decode(json_encode($query->result()[0]), true);
		};
		
		if (in_array((int)$data['id'],$admins)) {
			$data['access_level'] = 4;
		}
		else
		{
			$data['access_level'] = 0;
		}
		$data['user_id'] = $data['id'];
		unset($data['id']);
		$data['email'] = $data['username'];
		unset($data['username']);
		$data['name'] = $data['full_name'];
		unset($data['full_name']);
		$DBstruct->close();
		$this->load->database('default', TRUE);
		
		$this->load->model("login_model");
		$this->load->model("logink_model");
		$this->load->model("logincake_model"); // !
		$this->load->model("settings_model");
		$this->load->model("register_model");
		
		$arr_user = $data;
		
		if ($arr_user) {
			$arr_user = $this->logink_model->getValsFromArray($arr_user);    
		}
		
		if (!$arr_user || !$arr_user['user_id'] || !$arr_user['email']) {
			$this->load->helper('url');
			redirect('http://'.$_SERVER['HTTP_HOST'].$this->url_login, 'location', 301);
		}
				
		// get by konstr id
		$login = $this->logink_model->getUserByKonstrId($arr_user['user_id']);
		
		// if ! - register
		if (!$login || $login->num_rows() == 0) {
			$login = $this->logink_model->registerUserKonstrId($arr_user);
		}
		
		if (!$login || $login->num_rows() == 0) {
			$this->load->helper('url');
			redirect('http://'.$_SERVER['HTTP_HOST'].$this->url_login, 'location', 301);
		}
		
		$user = $login->row();
		// if ! eq - update
		if ($user->email != $arr_user['email'] || $user->name != $arr_user['name']) {
			$login = $this->logink_model->updateUserKonstrId($user->ID,$arr_user);
			$user = $login->row();
		}
		
		if (!$this->user->loggedin || $user->ID != $this->user->info->ID) {
			redirect(site_url("logink/index/".$uid));
		}
		
		if($this->user->info) {
			if($this->user->info->access_level == 0) {
				redirect('tickets');
			}
			if($this->user->info->access_level == 1) {
				redirect('agent');
			}
			if($this->user->info->access_level > 1) {
				redirect('sp_panel');
			}
		}
		$this->goIndex();
	}
	
	
	public function index($uid = null)
	{
		// authorize && redirect to index
		
		$this->load->model("logincake_model"); // !
		$arr_user = $this->logincake_model->getUserAuthData($uid);
		
		if ($arr_user) {
			$arr_user = $this->logink_model->getValsFromArray($arr_user);    
		}

		$kuser_id = isset($arr_user['user_id']) ? (int)$arr_user['user_id'] : 0;
		
		$login = $this->logink_model->getUserByKonstrId($kuser_id);
		
		if ($login->num_rows() == 0) {
			$this->goLogin();
		}
		
		$user = $login->row();
		if ($this->user->loggedin && $user->ID == $this->user->info->ID) {
			$this->goIndex();
		}
		
		$userid = $user->ID;
		$email = $user->email;
		
		// Generate a token
		$token = rand(1,100000) . $email;
		$token = md5(sha1($token));

		// Store it
		$this->login_model->updateUserToken($userid, $token);

		// Create Cookies
		$ttl = 3600;

		// Destroy old session data
		session_destroy();
		$_SESSION['cod'] = "";
		$_SESSION['tid'] = 0;

		setcookie("scun", $email, time()+$ttl, "/");
		setcookie("sctkn", $token, time()+$ttl, "/");
		
		$this->goIndex();
	}
	
	
	function goLogin()
	{
		$this->load->helper('url');
                redirect('http://'.$_SERVER['HTTP_HOST'].$this->url_login, 'location', 301);
	}
	
	
	function goIndex()
	{
                $this->load->helper('url');
		redirect(site_url());
	}
	
	
	
	public function logout($hash) 
	{
		$this->load->helper("cookie");
		if ($hash != $this->security->get_csrf_hash() ) {
			$this->template->error(lang("error_msg_token"));
		}
		delete_cookie("scun");
		delete_cookie("sctkn");
		redirect( site_url() );
	}
}

?>
