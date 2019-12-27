<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Article extends CI_Controller 
{

	public function __construct() 
	{
		parent::__construct();
		$this->load->model("article_model");
		if($this->settings->info->kb_login) {
			if (!$this->user->loggedin) {
				$this->template->error(lang("error_msg_login"));
			}
		}
	}

	public function index() 
	{
		$articles = $this->article_model->getNewestArticles(10);
		$categories = $this->article_model->getCategories();
		$this->template->loadContent("article/index.php", 
			array(
				"articles" => $articles,
				"categories" => $categories
			)
		);
	}

	public function view($catname, $name="") 
	{
		$this->template->loadExternal(
			'<script type="text/javascript" src="'
			.base_url().'scripts/article.js" /></script>'
		);
		if($this->settings->info->disable_seo) {
			$id = intval($catname);
			$article = $this->article_model->getArticle($id);
		} else {
			$name = str_replace("-", " ", $name);
			$article = $this->article_model->getArticleByName($name);
		}
		if ($article->num_rows() == 0) {
			$this->template->error(lang("error_msg_article"));
		}

		$this->template->loadContent("article/view.php", 
			array(
				"article" => $article->row()
			)
		);
	}

	public function search() 
	{
		$search = $this->lib_filter->removeHTML(
			$this->input->post("search", true));
		if (empty($search)) {
			$this->template->error(lang("error_msg_search"));
		}

		$articles = $this->article_model->getArticlesBySearch($search);
		if ($articles->num_rows() == 0) {
			$this->template->error(
				lang("error_msg_kbs")
			);
		}

		$this->template->loadContent("article/search.php", 
			array(
				"articles" => $articles,
				"searchterm" => $search
			)
		);
	}

	public function category($name,$limit=0) 
	{
		$limit = intval($limit);

		if($this->settings->info->disable_seo) {
			$id = intval($name);
			$category = $this->article_model->getCategory($id);
			$config['base_url'] = site_url("article/category/" . $id . "/");
		} else {
			// Get Category
			$name_original = $name;
			$name = str_replace("-", " ", $name);
			$category = $this->article_model->getCategoryByName($name);
			$config['base_url'] = site_url("article/category/" . $name_original . "/");
		}
		if ($category->num_rows() == 0) {
			$this->template->error(lang("error_msg_cat"));
		}
		$cat = $category->row();
		$this->load->library('pagination');

		$config['total_rows'] = $this->article_model->getArticleCount($cat->ID);
		$config['per_page'] = 20;
		$config['uri_segment'] = 4;

		$this->pagination->initialize($config); 

		// Articles
		$articles = $this->article_model->getArticlesByCat($cat->ID,$limit);

		$this->template->loadContent("article/category.php", 
			array(
				"category" => $cat,
				"articles" => $articles
			)
		);
	}

	public function vote() 
	{
		if (!$this->user->loggedin) {
			$this->template->errori(lang("error_msg_login2"));
		}
		$id = intval($this->input->get("articleid"));
		$vote = intval($this->input->get("vote"));
		$tok = ($this->input->get("tok"));

		if ($tok != $this->security->get_csrf_hash()) {
			$this->template->errori(lang("error_msg_token"));
		}

		// Get article
		$article = $this->article_model->getArticle($id);
		if ($article->num_rows() == 0) {
			$this->template->errori(lang("error_msg_article"));
		}

		if ($this->settings->info->article_voting) {
			$this->template->errori(lang("error_msg_article2"));
		}

		// CHeck user hasn't already voted
		if ($this->article_model->checkUserVote($id, $this->user->info->ID)) {
			$this->template->errori(lang("error_msg_vote"));
		}

		// Vote
		$this->article_model->voteArticle($id, $vote);
		$this->article_model->addUserVote($id, $this->user->info->ID);

		$article = $article->row();
		if ($vote) {
			$article->useful_votes++;
			$article->total_votes++;
		} else {
			$article->total_votes++;
		}

		// Display results
		$this->template->loadAjax("article/vote.php", 
			array(
				"useful_votes" => $article->useful_votes,
				"total_votes" => $article->total_votes
			)
		);

	}

}

?>
