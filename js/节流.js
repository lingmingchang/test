var oDiv = document.getElementById("show");
var oBtn = document.getElementById("btn");
var catchKey = false;

function throttle(handler, wait) {
	var lastTime = 0;
	return function(e) {
		var nowTime = new Date().getTime()
		if (nowTime - lastTime > wait) {
			handler.apply(this, arguments)
			lastTime = nowTime;
		}
	}
}


function buy(e) {
	console.log(this, e)
	oDiv.innerText = parseInt(oDiv.innerText) + 1;
}

oBtn.onclick = throttle(buy, 1000);
