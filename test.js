const path = require('path')
const fs = require('fs')

let file = path.dirname(path.dirname(__dirname))+'/plugins/distance-calc'
let p = file+ '/blocks/distance/built'
console.log('p',p)
fs.stat(file, (err,stats)=>{
	if( err){
		console.log(err)
		return false
	}

	console.log(stats)
})