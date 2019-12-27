<?php

class Article_Model extends CI_Model 
{

	public function getArticle($id) 
	{
		return $this->db->where("articles.ID", $id)
		->select("articles.title, articles.ID, articles.total_votes, 
			articles.useful_votes, articles.content,articles.timestamp, 
			article_categories.ID as catid, article_categories.name")
		->join("article_categories", "article_categories.ID = articles.catid")
		->get("articles");
	}

	public function getArticleByName($name) 
	{
		return $this->db->where("articles.title", $name)
		->select("articles.title, articles.ID, articles.total_votes, 
			articles.useful_votes, articles.content,articles.timestamp, 
			article_categories.ID as catid, article_categories.name")
		->join("article_categories", "article_categories.ID = articles.catid")
		->get("articles");
	}

	public function checkUserVote($id, $userid) 
	{
		$s = $this->db->where("articleid", $id)->where("userid", $userid)
		->get("article_votes");
		if($s->num_rows() > 0) {
			return true;
		} else {
			return false;
		}
	}

	public function voteArticle($id, $vote) 
	{
		$this->db->where("ID", $id);
		if($vote) {
			$this->db->set("useful_votes", "useful_votes+1", FALSE);
			$this->db->set("total_votes", "total_votes+1", FALSE);
		} else {
			$this->db->set("total_votes", "total_votes+1", FALSE);
		}

		$this->db->update("articles");
	}

	public function addUserVote($id, $userid) 
	{
		$this->db->insert("article_votes", 
			array("userid" => $userid, "articleid" => $id));
	}

	public function getNewestArticles($limit) 
	{
		return $this->db->select(
			"articles.title, articles.ID, articles.total_votes,
			 articles.useful_votes, articles.content,articles.timestamp,
			 article_categories.ID as catid, article_categories.name")
		->join("article_categories", "article_categories.ID = articles.catid")
		->limit($limit)
		->order_by("articles.ID", "DESC")
		->get("articles");
	}

	public function getCategories() 
	{
		return $this->db->select("name,ID,article_count, article_desc")
		->get("article_categories");
	}

	public function getCategoryByName($name) 
	{
		return $this->db->where("name", $name)
		->select("name,ID,article_count, article_desc")
		->get("article_categories");
	}

	public function getCategory($catid) 
	{
		return $this->db->where("ID", $catid)
		->select("name,ID,article_count, article_desc")
		->get("article_categories");
	}

	public function getArticlesByCat($catid, $limit) 
	{
		return $this->db->where("articles.catid", $catid)
		->select("articles.title, articles.ID, articles.total_votes, 
			articles.useful_votes, articles.content,articles.timestamp, 
			article_categories.ID as catid, article_categories.name")->
		join("article_categories", "article_categories.ID = articles.catid")
		->limit(20, $limit)
		->get("articles");
	}

	public function getArticlesBySearch($search) 
	{
		return $this->db->like("articles.content", $search)->
		select("articles.title, articles.ID, articles.total_votes, 
			articles.useful_votes, articles.content,articles.timestamp, 
			article_categories.ID as catid, article_categories.name")
		->join("article_categories", "article_categories.ID = articles.catid")
		->limit(50)
		->get("articles");
	}

	public function getArticleCount($catid) 
	{
		return $this->db->where("catid", $catid)
		->select("COUNT(*) as num")->get("articles")->row()->num;
	}

}

?>
