const express= require('express')
const morgan=require('morgan')
const cors = require('cors')



const app=express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan('dev'))

//middleWare
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

let persons=[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]



//APP.GETS
app.get('/',(request,resposne)=>{
    resposne.json(persons)
})
app.get('/persons/:id',(request,response)=>{
    const id=(request.params.id);
    const person= persons.find((person)=> person.id===id)
    if(!person)
        response.status(404).end()
    else
        response.json(person)
})
app.get('/info',(request,resposne)=>{
    resposne.send(
        `<h2> Phone book has info for ${persons.length} people</h2>
        <h3>${Date.now()}</h3>`
    )
})


const genrateId=()=>{
    return Math.floor(Math.random()*10000);
}
//APP.POSTS
app.post('/persons',(request,response)=>{
    const body=request.body;
    if(!body.name || !body.number)
        {
            return response.status(400).json({
                error:"Name or Number is missing" 
            })
        }
        const nameExists=persons.find(person=> person.name===body.name)
        
        if(nameExists){
            return response.status(400).json({
                error:"Name already in the file" 
            })
        }
        
        const person = {
            name:body.name,
            number:body.number,
            id:genrateId()
    }
    
    persons.push(person)
    response.json(person)
    
})



//APP.DELETES
app.delete('/persons/:id',(request,response)=>{
    const id=request.params.id;
    persons=persons.filter((person)=> person.id!==id)
    console.log(`person with id:${id} deleted`);
    response.status(204).end()
})




app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT , ()=>{
    console.log('HELLO')
})