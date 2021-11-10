import express from 'express';

let app = express();
app.use(express.json());
app.use(express.urlencoded);

class Growdever {
   constructor(public id: number, public nome: string, public idade: number, public turma: number, public tecnologias: string[] = [], public cidade: string) {
      this.id = id;
      this.nome = nome;
      this.idade = idade;
      this.turma = turma;
      this.tecnologias = tecnologias;
      this.cidade = cidade;
   }
}

let growdevers: Growdever[] = [];

//middlewares
let log = (req: express.Request, res: express.Response, next: express.NextFunction) => {
   console.log(req.ip, req.url, req.method, req.route);
};

let letras = /[a-zA-Z]/g;
let simbolos = /(?=.*[@!#$%^&*_()])/;

let parametros = (req: express.Request, res: express.Response, next: express.NextFunction) => {
   let id = req.params.id;
   if (id.match(letras) || id.match(simbolos)) {
      res.status(400).send({ message: 'formato de id invalido' });
   }
   for (let aluno of growdevers) {
      if (aluno.id == parseInt(id)) {
         return next();
      } else {
         return res.status(400).send({ message: `id nao existe` });
      }
   }
};

let token = (req: express.Request, res: express.Response, next: express.NextFunction) => {
   let token = req.body;
   if (token) {
      next();
   } else res.status(400).send({ message: 'faca login' });
};

app.use(log);

//rotas

app.get('login', (req: express.Request, res: express.Response) => {
   let { email, senha } = req.body;
   if (email == 1 && senha == 2) {
      return res.status(200).send({ token: Math.random().toString(36).substring(2) });
   } else res.status(400).send({ message: 'deu ruim' });
});

let id = 0;
app.post('/novo', (req, res) => {
   let { nome, idade, turma, tecnologias, cidade } = req.body;
   if (!nome) {
      res.status(418).send('Preencha o nome!');
   }
   let novo: Growdever = new Growdever(id, nome as string, parseInt(idade as string), parseInt(turma as string), tecnologias, cidade);
   growdevers.push(novo);
   id++;
   res.send(novo);
});

app.get('/growdev/:id', [token, parametros], (req: express.Request, res: express.Response) => {
   let id = req.params.id;
   let indexDoAluno = parseInt(id) - 1;
   res.status(200).send({
      mensagem: 'ok',
      aluno: growdevers[indexDoAluno],
   });
});

app.get('/growdevers', token, (req, res) => {
   let turma = parseInt(req.query.turma as string);

   if (turma) {
      let alunos = growdevers.filter((e) => {
         return e.turma == turma;
      });

      return res.send({
         mensagem: 'ok',
         alunos: alunos,
      });
   }

   res.send({
      mensagem: 'ok',
      alunos: growdevers,
   });
});

let porta = 8888;
app.listen(porta, () => console.log(`Iniciou na porta ${porta}`));
