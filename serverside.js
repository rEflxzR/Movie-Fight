let express = require('express')
let app = express()
let path = require('path')

app.use(express.static(path.join(__dirname)))
app.use("/styles", express.static(__dirname))
app.use("/scripts", express.static(__dirname + '/scripts'));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'))
})

app.listen(3000)