const SUPABASE_URL = "https://lclaeoissffwztnilkxg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjbGFlb2lzc2Zmd3p0bmlsa3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjU4OTEsImV4cCI6MjA3ODU0MTg5MX0.xcZ0F2Oh-BR-86iOq2hqoKvvnzXa_XjCYEJ7G1zLyhA";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Referências dos elementos HTML
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const addItemBtn = document.getElementById('add-item-btn');

// Cadastro
signupBtn.addEventListener('click', async () => {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert('Cadastro realizado! Verifique seu e-mail.');
});

// Login
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else loadUser();
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  document.getElementById('user-section').style.display = 'none';
  alert('Saiu da conta!');
});

// Adicionar item
addItemBtn.addEventListener('click', async () => {
  const user = (await supabase.auth.getUser()).data.user;
  const nome = document.getElementById('item-nome').value;
  const descricao = document.getElementById('item-desc').value;

  const { error } = await supabase.from('items').insert([{ user_id: user.id, nome, descricao }]);
  if (error) alert(error.message);
  else loadItems();
});

// Carregar dados do usuário
async function loadUser() {
  const user = (await supabase.auth.getUser()).data.user;
  if (user) {
    document.getElementById('user-section').style.display = 'block';
    document.getElementById('user-email').textContent = user.email;
    loadItems();
  }
}

// Listar itens
async function loadItems() {
  const user = (await supabase.auth.getUser()).data.user;
  const { data, error } = await supabase.from('items').select('*').eq('user_id', user.id);
  if (error) {
    alert(error.message);
    return;
  }

  const lista = document.getElementById('lista-itens');
  lista.innerHTML = '';
  data.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} - ${item.descricao}`;
    lista.appendChild(li);
  });
}

// Checar sessão ativa
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) loadUser();
});
