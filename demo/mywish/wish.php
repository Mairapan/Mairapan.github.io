<?php
header('Content-Type: text/html; charset=utf-8');
/*
	Author:strive
	How to use:
		1. 发表许愿
		wish.php?act=add&username=xxx&content=xxx
			{error:1, msg:xxx, id: 心愿ID, time: 1435567718}
		2. 获取所有心愿
		wish.php?act=get
			{error:0, msg:[{'id':1, 'username':'xxx', 'content':'xxx', time: 1435567718},{},{},{}.......]}
		3. 删除心愿
		wish.php?act=delete&id=0;
			{error:1, msg:xxx}
*/
function echo_str($str){
	global $cb;
	if(strlen($cb)){
		die($cb.'('.$str.')'); 	
	}else{
		die($str);	
	}	
}

$link=@mysql_connect('localhost','root','root') or mysql_connect('localhost','root','root');
mysql_query("set names 'utf8'");
mysql_query('CREATE database zns_wish');
mysql_select_db('zns_wish');


mysql_query("CREATE TABLE `wish` (
  `ID` int(11) NOT NULL auto_increment,
  `username` varchar(50) NOT NULL,
  `content` varchar(50) NOT NULL,
  `time` int(50) NOT NULL,
  PRIMARY KEY  (`ID`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1");


$act=$_GET['act'];
switch($act){
	case 'add':
		$username=$_GET['username'];
		$content=$_GET['content'];
		if(empty($username) || empty($content)){
			echo_str('{error:1, msg:"内容不能为空"}');
			exit;	
		}
		$i_sql="INSERT INTO  `zns_wish`.`wish` (`ID` ,`username` ,`content`,`time`) VALUES (NULL ,  '".$username."',  '".$content."',".time().")";
		mysql_query($i_sql);
		
		$res=mysql_query("SELECT LAST_INSERT_ID() AS ID;");
		$row=mysql_fetch_row($res);
		echo_str('{error:0, msg:"发表心愿成功", id: '.$row[0].', time: '.time().'}');
		break;
	case 'get':
		$s_sql="SELECT * FROM wish";
		$s_res=mysql_query($s_sql);
		if(!$s_res){
			echo_str('{error:1, msg:"还没有人发表心愿"}');
			exit;
		}
		
		while($row=mysql_fetch_row($s_res)){
			$msg[]=array(
				'id' => $row[0],
				'username' => $row[1],
				'content' => $row[2],
				'time' => $row[3]
			);
		}
		if(empty($msg)){
			echo_str('{error:1, msg:"还没有人发表心愿"}');
			exit;	
		}
		echo_str('{error:0, msg:'.json_encode($msg).'}');
		break;
	
	case 'delete':
		$id=$_GET['id'];
		if(empty($id)){
			echo_str('{error:1, msg:"您拼凑的接口有问题"}');
			exit;	
		}
		$d_sql="DELETE FROM wish WHERE id=".$id;
		mysql_query($d_sql);
		echo_str('{error:0, msg:"删除心愿成功"}');
		break;
}
?>