const express = require("express")
const app = express()
const cors = require('cors')

// app.use(cors())
app.use(express.json())//JSON parser it allows access to the data sent with the request(POST request)
app.use(express.static('dist')) 

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

// const app = http.createServer((request,response)=>
//   {
//     response.writeHead(200, {'Content-Type': 'application/json'})
//     response.end(JSON.stringify(notes))
//   })

app.get('/',(req,res)=>
  {
    res.send('<h2>Hello World</h2>')
  })

app.get('/api/notes',(req,res)=>
    {
      res.json(notes)
    })
  
app.get('/api/notes/:id',(req,res)=>
      {
        const id = req.params.id 
        const note = notes.find(find=> find.id === id)
        if(note)
          {
            res.json(note)
          }
          else
          {
            res.status(404).end()//undefined is false
          }
      })

app.delete('/api/notes/:id',(req,res)=>
      {
        const id = req.params.id 
        notes = notes.filter(item => item.id !== id)

        res.status(204).end()//204 means no content
      })

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const body = req.body

  const noteIndex = notes.findIndex(n => n.id === id)

  if (noteIndex !== -1) {
    const updatedNote = { ...notes[noteIndex], important: body.important }
    notes[noteIndex] = updatedNote
    res.json(updatedNote)
  } else {
    res.status(404).end()
  }
})

const generatedId = ()=>
  {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
    //spreading notes turns the array into individual numbers
    return String(maxId + 1)//new Id for new Note
  }
    
app.post('/api/notes',(req,res)=>//post is handled by req
      { 
        const body = req.body 

        if(!body.content)
          {
            return res.status(400).json({error:'Missing Content'})
          }
        const note = 
        {
          content:body.content,
          important: body.important || false,
          id:generatedId()
        }
       
        notes = notes.concat(note)
        res.json(note)
      })

  const PORT = process.env.PORT || 3001
  app.listen(PORT,()=>
    {
      console.log(`Server running on PORT: ${PORT}`)
    })

    /*
    The problem with the missing Content-Type header can be solved 
    when the request headers are printed in the backend, for example. 
    console.log(request.headers).
    */