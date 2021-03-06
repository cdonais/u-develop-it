const db=require('./db/connection');
const express=require('express');
const inputCheck=require('./utils/inputCheck');
const PORT=process.env.PORT||3001;
const app=express();
const apiRoutes=require('./routes/apiRoutes');

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/api',apiRoutes);
app.get('/api/parties',(req,res)=>{
    const sql=`SELECT * FROM parties`;
    db.query(sql,(err,rows)=>{
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message:'success',
            data:rows
        });
    });
});
app.get('/api/party/:id',(req,res)=>{
    const sql=`SELECT * FROM parties WHERE id=?`;
    const params=[req.params.id];
    db.query(sql,params,(err,row)=>{
        if(err){
            res.status(400).json({error:err.message});
            return;
        }
        res.json({
            message:'success',
            data:row
        });
    });
});
app.delete('/api/party/:id',(req,res)=>{
    const sql=`DELETE FROM parties WHERE id=?`;
    const params=[req.params.id];
    db.query(sql,params,(err,result)=>{
        if(err){
            res.status(400).json({error:res.message});
        } else if (!result.affectedRows){
            res.json({
                message:'Party not found'
            });
        } else {
            res.json({
                message:'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});
app.get('/',(req,res)=>{
    res.json({
        message: 'Hello World'
    });
});
app.use((req,res)=>{
    res.status(404).end();
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});