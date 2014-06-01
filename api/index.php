<?php

//ini_set("display_errors", "on");
session_start();
require_once __DIR__.'/../vendor/autoload.php';
require_once('./BaseUtil.class');
require_once('./SearchUtil.class');

$app = new Silex\Application();

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array (
        'driver'    => 'pdo_mysql',
        'host'      => 'localhost',
        'dbname'    => 'dirtydags',
        'user'      => 'dirtydags',
        'password'  => 'dirty123',
        'charset'   => 'utf8',
    )
));

$GLOBALS['_db'] = $app['db'];

$app->before(function () use ($app) {
    if (0 === strpos($app['request']->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($app['request']->getContent(), true);
        $app['request']->request->replace(is_array($data) ? $data : array());
    }
});

$app->get('/search', function() use ($app) {
    $query = trim($_GET['q']);
    $context = null;
    if (!empty($_GET['context'])) {
      $context= $_GET['context'];
    }	
    switch ($context) {
     case 'suggestion':
	$return = SearchUtil::pickSuggestion($query);
	break;
	
     default:
	$return = SearchUtil::keywordSearch($query);
	break;
    }
    return $app->json($return);
});


$app->get('/users/{id}', function($id) use ($app){
    $sql = "SELECT user_id, fullname, email FROM user WHERE user_id = ?";
    $user = $app['db']->fetchAssoc($sql, array($id));
    return $app->json($user);
});

$app->post('/users', function() use ($app) {
    $user = $app['request']->request->all();
    $user['password'] = md5($user['password']);
    $user['modified'] = $user['created'] = date('Y-m-d H:i:s');
    $app['db']->insert('user', $user);
    $auth_data = SearchUtil::getUserByEmail($user['email']);
    $_SESSION['auth'] = $auth_data;
    return $app->json($user, 201);
});

$app->post('/login', function() use ($app) {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $sql = "select user_id, fullname, email from user where email = '" . addslashes($email) . "' and password = '" . md5($password) . "'";
    $stmt = $GLOBALS['_db']->query($sql);
    $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (is_array($row) && is_array($row[0]) && $row[0]['user_id']) {
      $user = $row[0];     
      $_SESSION['auth'] = $user;
      return $app->json($user, 200);	
    } else {
      $user = false;
      return $app->json($user, 401);
    }
});

$app->post('/logout', function() use ($app) {
    $_SESSION = array();
    return $app->json(true, 200);
});

$app->get('/getauth', function() use ($app) {
     $auth = is_array($_SESSION['auth']) ? $_SESSION['auth'] : false;
     return $app->json($auth, 200);	
});

$app->get('/favorite', function() use ($app) {
		$favorite = $_GET['song_id'];
		$user = $_SESSION['auth']['user_id'];
		$existing_favorite = SearchUtil::getUserFavorite($user, $favorite);
		if (!$existing_favorite) {
			$favorite_data = array('song_id' => $favorite,
														 'user_id' => $user,
														 'created' => date('Y-m-d H:i:s')
														 );
			$app['db']->insert('favorite', $favorite_data);
		}
    return $app->json(true, 201);
});

$app->get('/favorites', function() use ($app) {
		$user = $_SESSION['auth']['user_id'];
		$sql = "select song.song_id, song.url from song inner join favorite on song.song_id = favorite.song_id and favorite.user_id = " . $user . " order by favorite.created desc";
		$stmt = $GLOBALS['_db']->query($sql);
		$data= $stmt->fetchAll(PDO::FETCH_ASSOC);
		$return = array();
		if (is_array($data) && count($data)) {
			foreach ($data as $d) {
				$return[] = $d;
			}
		}
    return $app->json($return, 201);
});

$app->run();
