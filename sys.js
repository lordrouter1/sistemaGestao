const fs = require('fs');
const { rimrafSync } = require('rimraf');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

if(process.argv.length < 4){
    console.log('Requer ao menos 1 argumento');
    return false
}

function new_(name,titulo){
    if(process.argv.length < 5){
        console.log('Requer 2 argumento para prosseguir');
        return false
    }

    fs.mkdirSync(`public/js/views/${name}`);

    fs.mkdirSync(`public/js/views/${name}/${name}`);
    fs.writeFileSync(`public/js/views/${name}/${name}/events.js`,`
$("#btn_excluir").click(()=>{
Swal.fire({
    icon:'warning',
    text:'Deseja Excluir?',
    showCancelButton: true,
    showConfirmButton: false,
    showDenyButton: true,
    denyButtonText: 'Excluir',
    cancelButtonText: 'Cancelar',
}).then((resp)=>{
    if(resp.isDenied){
        $.ajax({
            url:\`/${name}/ed/\`+$(\`#_id\`).val(),
            method: \`DELETE\`,
            statusCode:{
                200: ()=>{
                    location.href = \`/${name}\`;
                },
                500: ()=>{
                    swal.fire({
                        icon: \`error\`,
                        title:\`Erro ao salvar\`
                    });
                }
            }
        });
    };
});
});
    `);
    fs.writeFileSync(`public/js/views/${name}/${name}/functions.js`,`
function delThis(self){
    $(self).parent().parent().remove();
}

$(document).ready(function(){
    $(document).on(\`click\`,\`.delButton\`,function(t){
        $(t.currentTarget).parent().parent().remove();
    });
});
    `);
    fs.writeFileSync(`public/js/views/${name}/${name}/sockets.js`,``);
    
    fs.mkdirSync(`public/js/views/${name}/index`);
    fs.writeFileSync(`public/js/views/${name}/index/functions.js`,`            
new gridjs.Grid({
columns: [
    {
        data: (row) => (row.ativo == 1)?row.nome:gridjs.html(row.nome+' <span class="badge bg-danger text-light">Inativo</span>'),
    },
    {
        id:'_id',
        name:'',
        width: '15%',
        formatter:(cell) => gridjs.html(\`
            <a href="/${name}/editar/\${cell}" class="btn btn-primary"><i class="fa-solid fa-pen"></i></a>
            <!--<button cliente="\${cell}" class="btn btn-secondary"><i class="fa-solid fa-eye"></i></button>-->
        \`),
    },
],
data:JSON.parse($('#conData').attr('val')),
search: true,
language:{
    'search':{
        'placeholder': 'Pesquisar',
    },
},
pagination: {
    limit: 10,
    summary: false,
},
}).render(document.getElementById("principal"));
    `);
    fs.writeFileSync(`public/js/views/${name}/index/socket.js`,``);
    fs.writeFileSync(`public/js/views/${name}/index/events.js`,``);

    fs.writeFileSync(`router/rotas/${name}.js`,`
const ObjectId = require('mongodb').ObjectId;

module.exports = (checkLogin,routers,con,cMongoDB,data)=>{

routers.get('/${name}',checkLogin,async (req,res)=>{
    res.render('${name}/index',{
        title:'${titulo}',
        data: JSON.stringify(await cMongoDB.db(req.session.user.database).collection('${name}').find({},{projection:{_id:1,nome:1,descricao:1}}).toArray())
    });
});

routers.get('/${name}/novo',checkLogin,async (req,res)=>{
    res.render('${name}/${name}',{
        title:'Novo ${titulo}',
        ${name}:{},
    });
});

routers.get('/${name}/editar/:id',checkLogin,async (req,res)=>{
    cMongoDB.db(req.session.user.database).collection('${name}').findOne({_id:new ObjectId(req.params['id'])}).then(async (r)=>{
        res.render('${name}/${name}',{
            title:'Editar ${titulo}',
            ${name}: r,
        });
    });
});

routers.route('/${name}/ed/:id',checkLogin)
.post(data.upload.none(),(req,res)=>{
    let db = cMongoDB.db(req.session.user.database).collection('${name}');
    if(req.params.id == 0){
        db.insertOne(req.body).then((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).redirect('/${name}?err');
            }else{
                res.status(200).redirect('/${name}?success');
            }
        });
    }else{
        db.updateOne({_id:new ObjectId(req.params.id)},{$set:req.body}).then((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).redirect('/${name}?err');
            }else{
                res.status(200).redirect('/${name}?success');
            }
        });
    }
})
.delete(async(req,res)=>{
    let temp;
    try{
        temp = await cMongoDB.db(req.session.user.database).collection('${name}').findOne({_id:new ObjectId(req.params.id)});

        cMongoDB.db(req.session.user.database).collection('${name}').deleteOne({_id:new ObjectId(req.params.id)});

        res.status(200).send(true);
    }catch(e){
        console.log(e);
        res.status(500).send(false);
    }
});

return routers;
}
    `);

    fs.mkdirSync(`views/${name}`);

    fs.writeFileSync(`views/${name}/${name}.ejs`,`
<%- include("../includes/header.ejs",{title:title});%>

<script src="/public/js/views/${name}/${name}/functions.js"></script>

<input type="hidden" id="_id" value="<%- ${name}['_id'] -%>">

<form id="form_cadastro" method="post" action="/${name}/ed/<%- ${name}['_id'] || 0 -%>">

    <div class="card">
        <div class="card-header bg-primary text-light">
            <strong>Dados Gerais</strong>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col">
                    <label for="nome">Nome</label>
                    <input type="text" name="nome" id="nome" class="form-control" value="<%- ${name}['nome'] -%>">
                </div>
                <div class="col-4">
                    <label for="ativo">Ativo</label>
                    <select name="ativo" id="ativo" class="form-control">
                        <option value="1" <%- (${name}['ativo'] != '0')?'selected':'' -%>>Sim</option>
                        <option value="0" <%- (${name}['ativo'] == '0')?'selected':'' -%>>Não</option>
                    </select>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <label for="descricao">Descrição</label>
                    <input type="text" name="descricao" id="descricao" class="form-control" value="<%- ${name}['descricao'] -%>">
                </div>
            </div>
        </div>
    </div>

    <div class="mt-3">
        <a href="/${name}" class="btn btn-secondary text-light">Voltar</a>
        <%- 
            (${name}['_id']!=undefined)?
            '<div id="btn_excluir" class="btn btn-danger text-light mr-1">Excluir</div><button type="submit" class="btn btn-primary text-light">Editar</button>':
            '<button type="submit" class="btn btn-primary text-light">Salvar</button>' 
        -%>
    </div>

</form>

<script src="/public/js/views/${name}/${name}/events.js"></script>
<script src="/public/js/views/${name}/${name}/sockets.js"></script>

<%- include("../includes/footer.ejs"); %>
    `);
    fs.writeFileSync(`views/${name}/index.ejs`,`
<%- include("../includes/header.ejs",{title:title}); %>

<table id="principal"></table>

<a class="btn btn-primary text-light" href="/${name}/novo">Adicionar</a>

<meta id="conData" val='<%-data-%>'>

<script src="/public/js/views/${name}/index/functions.js"></script>

<div class="modal fade" id="mdl_${name}">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h4><strong><span id="mdl_nome"></span></strong></h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="border p-2 rounded">
                    <div class="row">
                        <div class="col">
                            <label for="">Descrição:</label>
                            <strong><span id="mdl_descricao"></span></strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="/public/js/views/${name}/index/sockets.js"></script>
<script src="/public/js/views/${name}/index/events.js"></script>

<%- include("../includes/footer.ejs"); %>
    `);
    console.log('Finalizada a inclusão!');
}

switch(process.argv[2]){
    case 'new':
        try{
            const name = process.argv[3];
            const titulo = process.argv[4];
            new_(name,titulo);
        }catch(e){
            console.log(e);
        }
        return;

    case 'del':
        try{
            if(process.argv.length < 4){
                console.log('Requer 1 argumento para prosseguir');
                return false;
            }

            const name = process.argv[3];
            readline.question(`Digite [${name}] para deletar:`,(resp)=>{
                if(resp == name){

                    rimrafSync(`views/${name}`);
                    rimrafSync(`public/js/views/${name}`);
                    fs.rmSync(`router/rotas/${name}.js`);

                    console.log('Arquivos deletados com sucesso!');
                }
                else{
                    console.log('Arquivos não deletados!');
                }
                readline.close();
            });
        }catch(e){
            console.log(e);
        }

        return;

    default:{
        console.log('Comando inválido!');
    }
}