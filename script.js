import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 🔧 Cole suas chaves do Supabase aqui
const SUPABASE_URL = 'https://SEU_PROJECT_URL.supabase.co'
const SUPABASE_ANON_KEY = 'SEU_ANON_PUBLIC_KEY'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const authDiv = document.getElementById('auth')
const appDiv = document.getElementById('app')
const emailInput = document.getElementById('email')
const senhaInput = document.getElementById('senha')
const userEmailSpan = document.getElementById('userEmail')
const listaItens = document.getElementById('listaItens')

// ---- LOGIN / CADASTRO ----
document.getElementById('btnLogin').onclick = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: senhaInput.value
  })
  if (error) {
    // Se não existir usuário, cria
    const { error: signupError } = await supabase.auth.signUp({
      email: emailInput.value,
      password: senhaInput.value
    })
    if (signupError) alert('Erro ao cadastrar: ' + signupError.message)
    else alert('Usuário cadastrado! Faça login novamente.')
  } else {
    carregarApp()
  }
}

// ---- LOGOUT ----
document.getElementById('btnLogout').onclick = async () => {
  await supabase.auth.signOut()
  authDiv.style.display = 'block'
  appDiv.style.display = 'none'
}

// ---- VERIFICA LOGIN ----
async function carregarApp() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  authDiv.style.display = 'none'
  appDiv.style.display = 'block'
  userEmailSpan.textContent = user.email
  carregarItens(user.id)
}

// ---- ADICIONAR ITEM ----
document.getElementById('btnAddItem').onclick = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return alert('Faça login')

  const nome = document.getElementById('nomeItem').value
  const desc = document.getElementById('descItem').value

  const { error } = await supabase.from('items').insert([{ user_id: user.id, nome, descricao: desc }])
  if (error) console.error(error)
  else carregarItens(user.id)
}

// ---- LISTAR ITENS ----
async function carregarItens(userId) {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .order('id', { ascending: false })

  listaItens.innerHTML = ''
  if (data) data.forEach(item => {
    const li = document.createElement('li')
    li.textContent = `${item.nome} — ${item.descricao || ''}`
    listaItens.appendChild(li)
  })
}

// Ao carregar a página, tenta restaurar sessão
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) carregarApp()
})
