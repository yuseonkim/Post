const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const static = require('serve-static');

const pool = mysql.createPool({
    connectionLimit : 10,
    host : '127.0.0.1',
    port: 3306,
    user: 'root',
    password : '0143',
    database : 'Node',
    debug : false,
});

app.set('views', "./src/views");
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true})); //post값 req.body로 받아오는 역할
app.use(express.json());
app.use(express.static(`${__dirname}/src/public`));

app.get('/',(req,res)=>{
    res.render('home/index');
});

app.get('/login',(req,res)=>{
    res.render('home/login');
});

app.get('/register',(req,res)=>{
    res.render('home/register');
})

app.post('/process/register',(req,res)=>{
    console.log('process/register 호출됨');
    const paramId = req.body.id;
    const paramPassword = req.body.password;
    const paramName = req.body.name;
    const paramAge = req.body.age;

    pool.getConnection((err,conn)=>{
        if(err){
            console.log("mysql 연결 중 오류 발생");
            return;
        }
        console.log("db연결완료");

        const exec = conn.query("insert into users (id,name,age,psword) values (?,?,?,?);",
        [paramId,paramName,paramAge,paramPassword],
        (err,result) => {
            conn.release();
            console.log(`실행된 sql : ${exec.sql}`);

            if(err){
                console.log('SQL 실행 시 오류 발생');
                        console.dir(err);
                         
                        res.writeHead("200", {'Content-Type': 'text/html; charset=utf-8'});
                        res.write('<h2>쿼리문 실행 실패</h2>');
                        res.end();
                        return;
                
            }

            if(result){
                console.dir(result);
                        console.log(`Inserted 성공`);
                        
                        res.writeHead("200", {'Content-Type': 'text/html; charset=utf-8'});
                        res.write('<h2>사용자 추가 성공</h2>');
                        res.end();
            }else{
                console.dir(result);
                        console.log(`Inserted 실패`);
                        
                        res.writeHead("200", {'Content-Type': 'text/html; charset=utf-8'});
                        res.write('<h2>사용자 추가 실패</h2>');
                        res.end();
            }
        }
    )})
})

app.listen(3000,()=>{
    console.log("서버시작");
})



