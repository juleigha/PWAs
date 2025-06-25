<!-- Site not redirecting to https; made php changes for owner -->

<?php
if ( !(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || !$_SERVER['SERVER_PORT'] == 443){
	header('Location: https://boomrandom.com');
}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel='manifest' href='/manifest1.webmanifest'>
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="apple-touch-icon" href="favicon_icons/icons/homeIcon.png">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="mobile-web-app-capable" content="Boom Random">
<!-- ios splashscreens - thanks to: https://appsco.pe/developer/splash-screens -->
<link href="favicon_icons/splashscreens/iphone5_splash.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="favicon_icons/splashscreens/iphone6_splash.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="favicon_icons/splashscreens/iphoneplus_splash.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
<link href="favicon_icons/splashscreens/iphonex_splash.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
<link href="favicon_icons/splashscreens/iphonexr_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="favicon_icons/splashscreens/iphonexsmax_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
<link href="favicon_icons/splashscreens/ipad_splash.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="favicon_icons/splashscreens/ipadpro1_splash.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="favicon_icons/splashscreens/ipadpro3_splash.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="favicon_icons/splashscreens/ipadpro2_splash.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<!-- Graph  -->
<meta property="og:title" content="Boom Random">
<meta property="og:description" content="What will Boom do next??">
<meta property="og:image" content="https://boomrandom.com/favicon_icons/share.png">
<meta property="og:url" content="http://boomrandom.com/index.index">
<meta property="og:site_name" content="Boom: Random">
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">

<title>Boom Random</title>
<script src="js/jqueryMin.js"></script>
<link rel="stylesheet" href="css/master.css">
<!-- <link rel="stylesheet" href="css/BootstrapMin.css"> -->
<!-- <script src="js/bootstrapMin.js"></script> -->
<link rel="stylesheet" href="css/fontAwesome.css">
</head>

	<body>
		<header>
			<script src="js/boom4.js"></script>
			<!-- Just an image -->
			<nav class="navbar lightSource-shadow">
				<a class="navbar-brand" href="#">
					<img src="Story/logo.jpg" class="lightSource-shadow" width="30" height="30" alt="">
				</a>
				<h1>Boom Random</h1>
			</nav>
			<span class="glyphicon glyphicon-book" aria-hidden="true"></span>
		</header>
		<div id="buttonchapter-btnBefore"></div>
		<button type="button" class="btn btn-secondary chapter-btn">
		Chapters
		</button>
		<div id="contentsTable">
			<ul>
		<?php
			// grab contents file (txt)
			$chapters = preg_split('/\r\n|\r|\n/', file_get_contents("contents.txt"));
			$chapter = [];
			$nav = "";
				/// build nav
				$chap=0;
				while(isset($chapters[$chap]) && $chapters[$chap] !== "") {
					$chapter["name"] = $chapters[$chap];
					$chap++;
					$chapter["folder"] = $chapters[$chap];
					$chap++;
					$chapter["chapterName"] = $chapters[$chap];
					$chap++;
					$chapter["chapterName"] = $chapters[$chap];
					$chap++;
					$chapter["chapterName"] = $chapters[$chap];
					$chap++;
					$chapter["numberOfPages"] = $chapters[$chap];
					$chap++;
					$nav.= "<li style='font-family: \"Palooka BB\"'><a href='#{$chapter["folder"]}' data-scroll='{$chapter["folder"]}'>{$chapter["name"]}</a></li>";

				}
			// write nav 
			echo $nav;
			?>
			</ul>
		</div>
		<div class="overlay"></div>
		<div class="comic-wrapper">
	<?php
			echo $comic;
			if( $handle = opendir("Story") ) {
				$paneID=0;
				$chap=0;
				while(isset($chapters[$chap])) {
					$chapter["name"] = $chapters[$chap];
					$chap++;
					$chapter["folder"] = $chapters[$chap];
					$chap++;
					$chapter["image"] = $chapters[$chap];
					$chap++;
					$chapter["date"] = $chapters[$chap];
					$chap++;
					$chapter["size"] = $chapters[$chap];
					$chap++;
					$chapter["numberOfPages"] = $chapters[$chap];
					$chap++;
					// $files = scandir("Story/{$chapter["folder"]}");
					// sort($files);
					// foreach($files as $file) {
					if ($chap > 6){
						echo "<span class='chapter-titleSpan'><em>{$chapter["name"]}</em></span><img    class='chapter_card' pane-ID='pane{$paneID}' pane-src='/css/chaptCard.svg' src='/css/chaptCard.svg' loading='lazy'><div class='dnldBtn' dnld='{$chapter["folder"]}'>Download {$chapter["name"]}</div><ul class='chapter-ul' id='{$chapter["folder"]}'>";
						$paneID++;
					}
					else {
						echo "<span class='chapter-titleSpan'><em style='color:black;'>{$chapter["name"]}</em></span><ul class='chapter-ul' id='{$chapter["folder"]}'>";
					}
					for($i=1;$i<=$chapter["numberOfPages"];$i++) {
							$e=sprintf("%02d", $i);
						// if(!is_dir($file)){
							$file = "page{$e}";
							echo "<li><img pane-ID='pane{$paneID}' pane-src='Story/{$chapter["folder"]}$file.jpg' src='' loading='lazy'></li>";
							$paneID++;
						// }
					}
					echo "</ul>";
				}
			}
			?>
		</div>
	</body>
	<script type="text/javascript" src="js/controller.js"></script>
</html>
