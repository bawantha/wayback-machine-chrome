const $container = document.getElementById('myModal');
if ($container.getAttribute('count') == 1) {
  const loading = document.createElement('div');
  loading.setAttribute('id', 'loading');
  $container.appendChild(loading);
  const animate = document.createElement('img');
  const fullURL = chrome.runtime.getURL('images/logo-animate.svg');
  animate.setAttribute('src', fullURL);
  animate.setAttribute('id', 'animated-logo');
  document.getElementById('loading').appendChild(animate);
}
chrome.runtime.sendMessage({ message: 'sendurlforrt' });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.RTurl != "") {
		let url = message.RTurl;
		if (url.includes('https')) {
			url = url.replace('https://', '');
		} else {
			url = url.replace('http://', '');
		}
		const pos = url.indexOf('/');
		if (pos != -1) url = url.substring(0, pos);
		const base_url = url;
		const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://web.archive.org/web/timemap/json?url=${url}/&fl=timestamp:4,original&matchType=prefix&filter=statuscode:200&filter=mimetype:text/html&collapse=urlkey&collapse=timestamp:4&limit=100000`, true);
		xhr.onerror = () => {
			const animateSvg = document.getElementById('animated-logo');
			document.getElementById('loading').removeChild(animateSvg);
			alert("An error occured. Please refresh the page and try again");
		};
		xhr.ontimeout = () => {
			const animateSvg = document.getElementById('animated-logo');
			document.getElementById('loading').removeChild(animateSvg);
			alert("Time out. Please refresh the page and try again");
		}
		xhr.onload = () => {
			const response = JSON.parse(xhr.responseText);
			const animateSvg = document.getElementById('animated-logo');
			document.getElementById('loading').removeChild(animateSvg);
      new wb.RadialTree(document.getElementById('loading'), response, {url});
		};
		xhr.send();
	}
});
