import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';

export default function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [fotoDocumento, setFotoDocumento] = useState('');
  const [tipo, setTipo] = useState(0); 
  const [enderecoId, setEnderecoId] = useState(0); 

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  };

  const validarDados = () => {
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return false;
    }
    if (!validarCPF(cpf)) {
      setErro('CPF inválido.');
      return false;
    }
    if (telefone.length < 10) {
      setErro('Número de telefone inválido.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);
    setCarregando(true);

    if (!validarDados()) {
      setCarregando(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Salva no Firestore (opcional)
      await addDoc(collection(db, 'usuarios'), {
        uid: user.uid,
        nome,
        email,
        cpf,
        telefone,
        tipo,
        enderecoId,
        fotoDocumento,
        emailVerificado: false,
        dataCadastro: new Date().toISOString(),
      });

      setSucesso(true);
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setCpf('');
      setTelefone('');
      setFotoDocumento('');
      setTipo(0);
      setEnderecoId(0);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErro('Este e-mail já está em uso por outro usuário.');
      } else if (error.code === 'auth/weak-password') {
        setErro('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setErro('Erro ao cadastrar usuário: ' + error.message);
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center">Cadastro de Usuário</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} className="input" />
                <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
                <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} className="input" />
                <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="input" />
                <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="input" />
                <input type="password" placeholder="Confirmar senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="input" />

                <input type="text" placeholder="URL da Foto do Documento" value={fotoDocumento} onChange={(e) => setFotoDocumento(e.target.value)} className="input" />

                <select value={tipo} onChange={(e) => setTipo(Number(e.target.value))} className="input">
                  <option value={0}>Usuário comum</option>
                  <option value={1}>Catador</option>
                </select>

                <input type="number" placeholder="Endereço ID" value={enderecoId} onChange={(e) => setEnderecoId(Number(e.target.value))} className="input" />
              </div>

              {erro && <div className="text-red-600 text-sm">{erro}</div>}
              {sucesso && <div className="text-green-600 text-sm">Cadastro realizado com sucesso!</div>}
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                {carregando ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}