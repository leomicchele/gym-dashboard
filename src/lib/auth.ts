// Función para validar email
export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// URL base para las peticiones
export const urlAmbientes = () => {
  return process.env.NEXT_PUBLIC_API_URL;
};

// Función para hacer el login
export const postFetchLogin = async({userName, password}: {userName: string, password: string}) => {
  const path = urlAmbientes();
  const isEmail = validateEmail(userName);
  let raw: any = {
    password
  };
  if (isEmail) raw.email = userName;
  if (!isEmail) raw.dni = userName;

  raw = JSON.stringify(raw);

  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: raw,
    redirect: 'follow' as RequestRedirect
  };

  try {
    const response = await fetch(`${path}/api/auth/login`, requestOptions);
    const result = await response.json()
    if (response.ok === true) return { message: "Ok", login: true, user: result, status: 200};
    if (response.status === 401) return { message: result.msg || "Usuario y/o contraseña incorrecta", login: false, status: 401};
    if (response.status === 400) return { message: result.msg || "No Registrado", login: false, status: 400};
    return { message: "Error desconocido", login: false, status: response.status};
  } catch (error) {
    console.log('Error en el login:', error);
    return { message: "Error en el servidor", login: false, status: 500};
  }
}; 