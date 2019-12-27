<?php

class Content_Model extends CI_Model 
{

	public function getStaff() 
	{
		return $this->db->select("name,access_level,bio_pic")
		->where("access_level > 0")->get("users");
	}

	public function getNewestArticles() 
	{
		return $this->db->select("articles.title, articles.content, articles.ID, article_categories.name")
		->join("article_categories", "article_categories.ID = articles.catid")
		->order_by("articles.ID", "DESC")->limit(2)->get("articles");
	}

	public function getPopularArticles() 
	{
		return $this->db->select("articles.title, articles.content, articles.ID, article_categories.name")
		->join("article_categories", "article_categories.ID = articles.catid")
		->order_by("articles.useful_votes", "DESC")
		->limit(2)
		->get("articles");
	}

	public function get_tweets($amount) 
	{
		return $this->db->get("tweets");
	}

	public function delete_tweets() 
	{
		$this->db->empty_table("tweets");
		$this->db->where("ID", 1)->update("site_settings", array
			("twitter_update" => time()));
	}

	public function add_tweet($name, $username, $tweet, $timestamp) 
	{
		$this->db->insert("tweets", array(
			"name" => $name,
			"username" => $username, 
			"tweet" => $tweet, 
			"timestamp" => $timestamp
			)
		);
	}
}

?>
