const nonCapTitleWords = [
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'for',
  'from',
  'in',
  'of',
  'off',
  'on',
  'onto',
  'or',
  'so',
  'than',
  'the',
  'to',
  'up',
  'via',
  'with',
  'yet'
]

export const toTitleCase = (s, splitOn = ' ') => {
  console.log(s)
  const mapFunc = (w, i, a) => {
    if (nonCapTitleWords.includes(w) && (i !== 0 || i !== a.length - 1)) {
      return w
    } else {
      return w[0].toUpperCase() + w.substr(1)
    }
  }

  return s?.toLowerCase()
    .split(splitOn)
    .map(mapFunc)
    .join(' ');
}

export const camelCaseToTitleCase = (text: string) => {
  const result = text.replace(/([A-Z])/g, " $1");
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return toTitleCase(finalResult)
}

export function clickOutside(node) {
	const handleClick = (event) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click_outside', node))
		}
	}

	document.addEventListener('click', handleClick, true)

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true)
		}
	}
}

export const getImageOrientation = (imgSrc: string): Promise<string> => {
  return new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => {
      if (img.width > img.height) {
        res('landscape')
      } else if (img.width < img.height) {
        res('portrait')
      } else if (img.width === img.height) {
        res('square')
      } else {
        res('error')
      }
    }
    img.onerror = rej
    img.src = imgSrc
  })
}

export const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = parseFloat(((millis % 60000) / 1000).toFixed(0))
  return (
    seconds == 60 ?
    (minutes+1) + ":00" :
    minutes + ":" + (seconds < 10 ? '0' : '') + seconds
  )
}

export const checkIfImageExists = (url, callback) => {
  const img = new Image();

  img.src = url;

  // if (img.complete) {
  //   callback(true);
  // } else {
    img.onload = () => {
      callback(true);
    };
    
    img.onerror = () => {
      callback(false);
    };
  // }
}