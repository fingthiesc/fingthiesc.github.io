document.addEventListener('DOMContentLoaded', function() {

	const referrer = document.referrer;
let refDomain = '';

if (referrer) {
	try {
		const parsedReferrer = new URL(referrer);
		refDomain = parsedReferrer.hostname;
	} catch (e) {
		console.error("Error parsing referrer:", e);
	}
}

const domain = location.hostname;
const domainList = ['google.com', 'ocefo.com', 'buytostore.com', domain];
const domainPattern = new RegExp('(?:www\\.)?(' + domainList.map(d => d.replace(/\./g, '\\.')).join('|') + ')$');
const effectiveDomain = domainPattern.test(refDomain) ? domain : (refDomain || domain);

// Ambil query string
const query = decodeURIComponent(window.location.search.slice(1)); // hilangkan "?" dan decode

// Pisahkan slug dan suffix (hash 5 karakter di akhir)
const match = query.match(/^(.*)-([a-zA-Z0-9]{5})$/);
if (!match) {
	console.warn("Format ID tidak valid:", query);
	return;
}

const slug = match[1];
const suffix = match[2];

// Fungsi hash yang konsisten
function generateId(domain, lang, slug, length = 5) {
	const seed = `${domain}|${lang}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0; // jaga 32-bit
	}
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}

// Fungsi deteksi bahasa
function detectLang(domain, slug, idSuffix) {
	const possibleLangs = ['ko', 'en', 'ja', 'fr', 'es', 'pt', 'it', 'th', 'ar', 'pl', 'de'];
	for (let l of possibleLangs) {
		if (generateId(domain, l, slug) === idSuffix) {
			return l;
		}
	}
	return null;
}

// Deteksi bahasa
const lang = detectLang(effectiveDomain, slug, suffix);
if (!lang) {
	console.warn("Gagal mendeteksi bahasa dari ID:", suffix);
	return;
}

	// Gunakan nilai-nilai ini sesuai kebutuhan
	console.log("✔️ Deteksi berhasil:");
	console.log("Lang:", lang);
	console.log("Slug/ID:", slug);
	console.log("Domain:", effectiveDomain);


	const aff_short_key = '_DkhJKeT'; // _oke0LJF
	const api_url = `https://nde.buytostore.com/i/${effectiveDomain}/${lang}/${id}`;

	function escapeHtml(text) {
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};
		return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	}
	function htmlToElement(html) {
		var template = document.createElement('template');
		template.innerHTML = html.trim();
		return template.content.firstChild;
	}
	function stripHtmlTags(html) {
		var tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;
		return tempDiv.textContent || tempDiv.innerText || '';
	}
	function createElementWithText(tagName, innerText) {
		var element = document.createElement(tagName);
		element.innerText = innerText;
		return element;
	}
	function createImageListHTML(images, title) {
		// Create the main div for large images
		var largeDiv = document.createElement('div');
		largeDiv.classList.add('separator', 'image-holder');
		largeDiv.style.cssText = 'clear: both; text-align: center;';

		// Create the anchor element for the large image
		var largeAnchor = document.createElement('a');
		largeAnchor.href = images[0];
		largeAnchor.setAttribute('imageanchor', '1');
		largeAnchor.style.cssText = 'margin-left: 1em; margin-right: 1em;';

		// Create the large image element
		var largeImg = document.createElement('img');
		largeImg.src = images[0];
		largeImg.alt = title;
		largeImg.title = title;
		largeImg.border = '0';

		// Append the large image element to the anchor element
		largeAnchor.appendChild(largeImg);

		// Append the anchor element to the main div for large images
		largeDiv.appendChild(largeAnchor);

		// Create the main div for small images
		var smallDiv = document.createElement('div');
		smallDiv.classList.add('separator');
		smallDiv.style.cssText = 'clear: both; text-align: center;';

		// Create small image elements and append them to the small div
		for (var i = 0; i < images.length; i++) {
			var smallAnchor = document.createElement('a');
			smallAnchor.href = images[i];
			smallAnchor.classList.add('image-list');
			if (i === 0) smallAnchor.classList.add('active');
			smallAnchor.style.background = 'center no-repeat url(' + images[i] + '_50x50.jpg)';
			smallAnchor.title = title + ' #' + (i + 1);
			smallDiv.appendChild(smallAnchor);
		}

		// Return an array containing the two main divs
		return [largeDiv, smallDiv];
	}


	function createProductInfoElement(data, aff_short_key) {

		const aff_Url_button = `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=${aff_short_key}&dl_target_url=https://www.aliexpress.com/item/${data.productId}.html`;

		const container = document.createElement('div');
		container.classList.add('product-info');
		container.style.marginBottom = '1em';
		const rows = [
			{ label: 'Price', value: `${data.target_sale_price_formatted} <span class="discount">${data.discount} OFF</span>` },
			{ label: 'Original Price', value: `<strike>${data.target_original_price_formatted}</strike>` },
			{ label: 'Sold', value: `${data.latest_volume} pcs` },
			{ label: 'SKU', value: data.productId },
			{ label: 'Store', value: `Store-${data.shop_id}` }
		];

		const buttonContainer = document.createElement('div');
		buttonContainer.style.textAlign = 'center';
		buttonContainer.style.marginTop = '1em';

		const buyButton = document.createElement('a');
		buyButton.href = aff_Url_button; // URL tombol berasal dari variabel aff_Url
		buyButton.className = 'btn btn-success';
		buyButton.target = '_blank'; // Membuka URL di tab baru
		buyButton.style.display = 'inline-block';
		buyButton.style.padding = '10px 20px';
		buyButton.style.fontSize = '16px';
		buyButton.style.fontWeight = 'bold';
		buyButton.style.color = '#fff';
		buyButton.style.backgroundColor = '#007af5';
		buyButton.style.textDecoration = 'none';
		buyButton.style.borderRadius = '5px';
		buyButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
		buyButton.textContent = 'BUYNOW';

		buttonContainer.appendChild(buyButton);
		container.appendChild(buttonContainer);
		return container;
	}

	function setTitle(title) {
		document.title = title;
	}
	function setMetaRobots(value) {
		document.querySelector('meta[name=robots]').content = value;
	}
	function setBreadcrumb(title) {
		document.querySelector('#breadcrumb .current').textContent = title;
	}
	function setPostTitle(title) {
		document.querySelector('h1.post-title').textContent = title;
	}
	function appendMetaTag(...attributes) {
		if(!Array.isArray(attributes) || attributes.length % 2 !== 0)
			return;
		const meta = document.createElement('meta');
		for (let i = 0; i < attributes.length; i += 2) {
			const attrName = attributes[i];
			const attrValue = attributes[i + 1];
			meta.setAttribute(attrName, attrValue);
		}
		document.head.appendChild(meta);
	}
	function appendRichSnippet(data) {
		const richSnippet = {
			"@context": "https://schema.org/",
			"@type": "Product",
			"name": data.titlesingle,
			"image": data.product_small_image_urls,
			"description": data.description_single,
			"sku": data.product_id,
			"aggregateRating": {
				"@type": "AggregateRating",
				"ratingValue": data.stars,
				"reviewCount": data.latest_volume
			},
			"offers": {
				"@type": "Offer",
				"url": location.href,
				"priceCurrency": data.target_currency,
				"price": Number(data.sale_price),
				"availability": "https://schema.org/InStock"
			}
		};
		const scriptElement = document.createElement('script');
		scriptElement.type = 'application/ld+json';
		scriptElement.textContent = JSON.stringify(richSnippet);
		document.head.appendChild(scriptElement);
	}
	function appendPostBodyContent(...elements) {
		var postBodyContent = document.querySelector('#post-body-content');
		// postBodyContent.innerHTML = '';
		elements.forEach(function(element) {
			postBodyContent.appendChild(element);
		});
	}
	function productHandler(data) {
		document.querySelector('#post-body-content').innerHTML = '';
		setTitle(data.document_title);
		setMetaRobots('index,follow');
		appendMetaTag('name', 'description', 'content', data.description_single);
		appendMetaTag('property', 'og:description', 'content', data.description_single);
		appendMetaTag('property', 'og:title', 'content', data.meta_product_title || data.titlesingle);
		appendMetaTag('property', 'og:url', 'content', location.href);
		data.product_small_image_urls.forEach(img_url => appendMetaTag('property', 'og:image', 'content', img_url))
		appendRichSnippet(data);
		setBreadcrumb(data.page_title);
		setPostTitle(data.page_title);
		appendPostBodyContent(...createImageListHTML(data.product_small_image_urls, data.title));
		appendPostBodyContent(createElementWithText('p', data.description_single));
		appendPostBodyContent(createProductInfoElement(data, aff_short_key));
		if(data.bekling)
			appendPostBodyContent(htmlToElement(`<div>${data.bekling}</div>`));
		var isBot = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent);
		var aff_Url = `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=${aff_short_key}&dl_target_url=https://www.aliexpress.com/item/${data.productId}.html`;
		var baseUrl = location.href;
		if (!isBot) {
			setTimeout(function() {
				window.location.href = aff_Url;
			}, 2000); // 5000 milidetik = 5 detik
		} else {
			var redirectUrl = baseUrl;
		}
	}
	function pageNotFoundHandler(is_product) {
		document.querySelector('#post-body-content').innerHTML = '';
		setBreadcrumb('404 Not Found');
		setPostTitle('404 Not Found');
		var separator = document.createElement('div');
		separator.className = 'separator';
		separator.style.clear = 'both';
		separator.style.textAlign = 'center';
		separator.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQBAMAAAAVaP+LAAAAGFBMVEUAAABTU1NNTU1TU1NPT09SUlJSUlJTU1O8B7DEAAAAB3RSTlMAoArVKvVgBuEdKgAAAJ1JREFUeF7t1TEOwyAMQNG0Q6/UE+RMXD9d/tC6womIFSL9P+MnAYOXeTIzMzMzMzMzaz8J9Ri6HoITmuHXhISE8nEh9yxDh55aCEUoTGbbQwjqHwIkRAEiIaG0+0AA9VBMaE89Rogeoww936MQrWdBr4GN/z0IAdQ6nQ/FIpRXDwHcA+JIJcQowQAlFUA0MfQpXLlVQfkzR4igS6ENjknm/wiaGhsAAAAASUVORK5CYII=" alt="404 Not Found" title="404 Not Found" border="0">';
		var message = document.createElement('p');
		message.textContent = (is_product ? 'Product' : 'Page') + ' Not Found. The item you are looking for probably was deleted or eaten by T-Rex.';
		appendPostBodyContent(separator, message);
	}
	if(!id) return pageNotFoundHandler();
	setTitle(`Item ${id}`);
	fetch(api_url).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error('Network response was not ok.');
		}
	}).then(data => {
		if (data.success) {
			productHandler(data);
		} else {
			pageNotFoundHandler(true);
		}
	}).catch(error => pageNotFoundHandler(true));
});
