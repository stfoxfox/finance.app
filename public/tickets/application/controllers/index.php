<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Index extends CI_Controller 
{

	public function __construct() 
	{
		 parent::__construct();
		 $this->load->model("content_model");
	}

	public function index()
	{
		$articles = $this->content_model->getNewestArticles();

		$this->template->loadExternal(
			"<script src='scripts/get_tweets.js'></script>
			<script src='scripts/knowledge.js'></script>");
		$this->template->loadContent("home/index.php", 
			array("articles" => $articles));
	}

	public function get_tweets() 
	{
		$tweets = array();
		if (!empty($this->settings->info->twitter_name)) {
			if($this->settings->info->twitter_update > time()-$this->settings->info->update_tweets) {
				// Get cached
				$tweets = $this->content_model->get_tweets($this->settings->info->twitter_display_limit);
				if($tweets->num_rows() == 0) {
					$tweets = $this->get_static_tweets();
				} else {
					$ntweets=array();
					foreach($tweets->result() as $r) {
						$ntweets[] = $r;
					}
					$tweets = $ntweets;
				}
			} else {
				$tweets = $this->get_static_tweets();
			}
		}
		$this->template->loadAjax("home/tweets.php", 
			array("tweets" => $tweets));
	}

	private function get_static_tweets() {
		require_once APPPATH . 'third_party/codebird.php';
		try {
			Codebird::setConsumerKey(
				$this->settings->info->twitter_consumer_key, 
				$this->settings->info->twitter_consumer_secret);
			$cb = Codebird::getInstance();
			$cb->setToken($this->settings->info->twitter_access_token, 
				$this->settings->info->twitter_access_secret);
			$tweets = $cb->statuses_userTimeline(
			 'screen_name=' . $this->settings->info->twitter_name 
			 . '&count=' . $this->settings->info->twitter_display_limit 
			 . '&exclude_replies=true&include_rts=1' );
		} catch (Exception $e) {
			$this->template->errori(
				"Exception: " . $e);
		}

		// Store tweets in database
		$this->content_model->delete_tweets();
		$new_tweets = array();
		$t=null;
		foreach($tweets as $tweet) {
			if(is_object($tweet)) {
				$t = new stdClass();
				$t->username = $tweet->user->name;
				$t->name = $tweet->user->screen_name;
				$t->tweet = $tweet->text;
				$t->timestamp = $tweet->created_at;
				$new_tweets[] = $t;
				$this->content_model->add_tweet($tweet->user->name, $tweet->user->screen_name, $tweet->text, $tweet->created_at);
			}
		}
		return $new_tweets;
	}

	public function get_articles() 
	{
		$type = intval($this->input->get("type"));
		if ($type ==0) {
			$articles = $this->content_model->getPopularArticles();
		} else {
			$articles = $this->content_model->getNewestArticles();
		}
		$this->template->loadAjax("home/articles.php", 
			array("articles" => $articles));
	}
}

?>
