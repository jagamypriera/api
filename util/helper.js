module.exports = {
	rand: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
	scale: (num, iMi, iMa, oMi, oMa) => ((num - iMi) * (oMa - oMi)) / (iMa - iMi) + oMi,
	curK: num => {
		if (!num) return 0
		if (num >= 1000000000) {
			return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G'
		}
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
		}
		if (num >= 1000) {
			return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
		}
		return num
	}
}
