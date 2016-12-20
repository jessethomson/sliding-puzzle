var context = document.getElementById('puzzle').getContext('2d');

var width;
var height;

// document.getElementById("original").onclick = function() {
// 	document.getElementById("original")
// }

document.getElementById('uploadedFile').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {

			// img.onload = function() {
		 //        // access image size here 
		 //        width = this.width;
		 //        height = this.height;
		 //    };
		    run(fr.result);
        }
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
}

function run(imgSrc) {
	document.getElementById("original").src = imgSrc;
	// console.log(img)
	var img = new Image();
	img.src = imgSrc;
	imgWidth = img.width;
	imgHeight = img.height;
	img.addEventListener('load', drawTiles, false);

	var boardSize = document.getElementById('puzzle').width;
	var tileCount = document.getElementById('scale').value;

	var tileSize = boardSize / tileCount;

	var clickLoc = new Object;
	clickLoc.x = 0;
	clickLoc.y = 0;

	var emptyLoc = new Object;
	emptyLoc.x = 0;
	emptyLoc.y = 0;

	var solved = false;

	var boardParts;
	setBoard();

	document.getElementById('scale').onchange = function() {
		tileCount = this.value;
		tileSize = boardSize / tileCount;
		setBoard();
		drawTiles();
	};

	document.getElementById('puzzle').onclick = function(e) {
		clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
		clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
		if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
			slideTile(emptyLoc, clickLoc);
			drawTiles();
		}
		if (solved) {
			setTimeout(function() {alert("You solved it!");}, 500);
		}
	};

	function setBoard() {
		boardParts = new Array(tileCount);
		for (var i = 0; i < tileCount; ++i) {
			boardParts[i] = new Array(tileCount);
			for (var j = 0; j < tileCount; ++j) {
				boardParts[i][j] = new Object;
				boardParts[i][j].x = (tileCount - 1) - i;
				boardParts[i][j].y = (tileCount - 1) - j;
			}
		}
		emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
		emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;
		solved = false;
	}

	function drawTiles() {
		context.clearRect ( 0 , 0 , boardSize , boardSize );
		for (var i = 0; i < tileCount; ++i) {
			for (var j = 0; j < tileCount; ++j) {
				var x = boardParts[i][j].x;
				var y = boardParts[i][j].y;
				if(i != emptyLoc.x || j != emptyLoc.y || solved == true) {
					context.drawImage(img, x * tileSize*(imgWidth/boardSize), y * tileSize*(imgHeight/boardSize), tileSize*(imgWidth/boardSize), tileSize*(imgHeight/boardSize),
						i * tileSize, j * tileSize, tileSize, tileSize);
				}
			}
		}
	}

	function distance(x1, y1, x2, y2) {
		return Math.abs(x1 - x2) + Math.abs(y1 - y2);
	}

	function slideTile(toLoc, fromLoc) {
		if (!solved) {
			boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
			boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
			boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
			boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;
			toLoc.x = fromLoc.x;
			toLoc.y = fromLoc.y;
			checkSolved();
		}
	}

	function checkSolved() {
		var flag = true;
		for (var i = 0; i < tileCount; ++i) {
			for (var j = 0; j < tileCount; ++j) {
				if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
					flag = false;
				}
			}
		}
		solved = flag;
	}
}