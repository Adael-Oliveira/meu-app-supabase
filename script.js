import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// === CONFIGURAÇÃO DO SUPABASE ===
const SUPABASE_URL = 'https://lclaeoissffwztnilkxg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // substitua pela sua
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// === FUNÇÃO: CADASTRO DE USUÁRIO ===
document.getElementById('signup-btn').addEventListener('click', async () => {
  const email = document.getElementById('signup-email').value
  const password = document.getElementById('signup-password').value

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) alert('Erro ao cadastrar: ' + error.message)
  else alert('Usuário cadastrado! Verifique seu e-mail para confirmar.')
})

// === FUNÇÃO: LOGIN ===
document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) alert('Erro no login: ' + error.message)
  else alert('Login realizado!')
})

// === FUNÇÃO: LOGOUT ===
document.getElementById('logout-btn').addEventListener('click', async () => {
  await supabase.auth.signOut()
  alert('Você saiu da conta!')
})

// === FUNÇÃO: CADASTRAR ITEM ===
document.getElementById('add-item-btn').addEventListener('click', async () => {
  const nome = document.getElementById('item-nome').value
  const user = (await supabase.auth.getUser()).data.user

  if (!user) {
    alert('Faça login antes de cadastrar um item!')
    return
  }

  const { error } = await supabase.from('itens').insert([{ nome, user_id: user.id }])
  if (error) alert('Erro ao adicionar item: ' + error.message)
  else {
    alert('Item adicionado!')
    listarItens()
  }
})

// === FUNÇÃO: LISTAR ITENS ===
async function listarItens() {
  const { data, error } = await supabase.from('itens').select('*')
  const lista = document.getElementById('lista-itens')
  lista.innerHTML = ''
  if (error) {
    lista.innerHTML = '<li>Erro ao carregar itens.</li>'
  } else {
    data.forEach(item => {
      const li = document.createElement('li')
      li.textContent = item.nome
      lista.appendChild(li)
    })
  }
}

// === CARREGAR ITENS AO INICIAR ===
listarItens()
