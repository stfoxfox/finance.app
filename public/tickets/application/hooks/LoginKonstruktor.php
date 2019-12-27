<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class LoginKonstruktor extends CI_Controller {
        
	public $url_login = '/client/login';
	public $arr_no_ctrls = array( 'user_settings', );
	public $arr_ok_ctrls = array( 'tickets', 'article', 'agent', 'sp_panel' );

	function checkLogin() {
			
		if ($this->router->fetch_class() == 'logink') {
			return;
		}
		
		if (!in_array($this->router->fetch_class(),$this->arr_ok_ctrls)) {
			/* 
				print_r($this->user->info->access_level);
				die;
			*/	
			if($this->user->info) {
				if($this->user->info->access_level == 0) {
					$this->goIndex();
				}
				if($this->user->info->access_level == 1) {
					$this->goAgent();
				}
				if($this->user->info->access_level > 1) {
					$this->goAdmin();
				}
			}
			$this->goIndex();
		}
	}
        
	function goLogink() {
		redirect(site_url("logink/index"));
	}
        
	function goLogin() {
		$this->load->helper('url');
		redirect('http://'.$_SERVER['HTTP_HOST'].$this->url_login, 'location', 301);
	}
        
	function goIndex() {
		redirect('tickets');
	}
        
	function goAgent() {
		redirect('agent');
	}
	
	function goAdmin() {
		redirect('sp_panel');
	}
    
    
}