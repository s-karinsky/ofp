export const isValidEmail = (email) => email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)

export const declOfNum = (value, words) => {  
	value = Math.abs(value) % 100
	var num = value % 10
	if(value > 10 && value < 20) return words[2];
	if(num > 1 && num < 5) return words[1]
	if(num == 1) return words[0]
	return words[2]
}

export const debounce = (func, timeout) => {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => { func.apply(this, args); }, timeout)
	}
}