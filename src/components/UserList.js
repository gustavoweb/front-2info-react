import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ nome: '', usuario: '', senha: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://api-user-2info.vercel.app/api/users');
      setUsers(response.data);
    } catch (error) {
      setError('Erro ao carregar usuários.');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`https://api-user-2info.vercel.app/api/users/${editingUser._id}`, form);
      } else {
        await axios.post('https://api-user-2info.vercel.app/api/users', form);
      }
      fetchUsers();
      setForm({ nome: '', usuario: '', senha: '' });
      setEditingUser(null);
    } catch (error) {
      setError('Erro ao enviar os dados.');
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ nome: user.nome, usuario: user.usuario, senha: '' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api-user-2info.vercel.app/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      setError('Erro ao deletar usuário.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Gerenciar Usuários</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Usuário"
          value={form.usuario}
          onChange={(e) => setForm({ ...form, usuario: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
          required={!editingUser}
        />
        <button type="submit">{editingUser ? 'Atualizar' : 'Adicionar'}</button>
      </form>

      <h3>Lista de Usuários</h3>
      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Usuário</th>
              <th>Senha</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.nome}</td>
                <td>{user.usuario}</td>
                <td>{user.senha}</td> {/* Exibindo a senha */}
                <td>
                  <button onClick={() => handleEdit(user)}>Editar</button>
                  <button onClick={() => handleDelete(user._id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
