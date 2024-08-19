<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: ../log.html");
    exit();
}

require 'conexion.php';

// sacar id del ssuario
$user_id = $_SESSION['user_id'];

// Consultar los datos del usuario
$sql = "SELECT * FROM usuarios WHERE Id = $user_id";
$result = mysqli_query($conexion, $sql);

if ($result && mysqli_num_rows($result) > 0) {
  $row = mysqli_fetch_assoc($result);
  $nombre = $row['first_name'];
  $apellido = $row['last_name'];
  $email = $row['email'];
  $numero = $row['phone'];
  $imagen = $row['foto'];


} else {
    die("No se encontraron datos para este usuario.");
}

mysqli_close($conexion);
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://stackpath.bootstrapcdn.com/bootstrap/5.3.3/css/bootstrap.min.css"
      rel="stylesheet"/>
      <link rel="icon" href="../imagenes/logo.png" type="image/x-icon">
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossorigin="anonymous"/>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"/>
    <link rel="stylesheet" href="../perfil.css">
    <title>El Coyotito | Perfil de Usuario</title>
</head>
<body>
<div class="container-fluid" id="navs">
      <div class="row">
        <div class="col-4 text-center col-1">
          <a href="#" onclick="location.reload();">
            <img src="./imagenes/El coyotito.png" style="width: 80%; height: auto; max-width: 80%" />
          </a>
          <div class="container" style="margin-top: 30px; padding: 0">
            <i>
              <h4 id="opc">
                <a href="index.html" class="animate-link" >Inicio |</a>
                <a href="#" class="opc2 animate-link" id="categorias" style="color: aliceblue;">Categorías |</a>
                  <div id="categoriasMenu" class="categoria-menu" style="display: none;">
                    <button class="categoriaopc" categoria="Belleza"><a href="#productostod" style="color: black;">Belleza</a></button>
                    <button class="categoriaopc" categoria="Papeleria"><a href="#productostod" style="color: black;">Papeleria</a></button>
                    <button class="categoriaopc" categoria="Accesorios"><a href="#productostod" style="color: black;">Accesorios</a></button>
                    <button class="categoriaopc" categoria="Juegos"><a href="#productostod" style="color: black;">Juegos</a></button>
                    <button class="categoriaopc" categoria="Todos"><a href="#productostod" style="color: black;">Todos</a></button>
                  </div>
                <a href="#contacto" class="animate-link">Contacto</a>
              </h4>
            </i> 
          </div>
        </div>
        <div class="col-4 text-center col-2">
          <a href="#" onclick="location.reload();">
            <img src="./imagenes/logo.png" id="logoop" />
          </a>
        </div>
        <div class="col text-center col-3 d-flex flex-column flex-md-row justify-content-md-end align-items-center">
          <div class="container">
            <button id="search-button" class="opc2">
              <a href="#" class="animate-link"><span class="material-symbols-outlined inverted-icon">search</span></a>
          </button>
          <div id="search-container" style="position: absolute; top: auto; right: 50px; width: 70%; margin: 0 auto;" class="hidden">
              <input type="text" id="search-input" placeholder="Buscar productos..." autofocus />
              <div id="search-results-container" class="search-results"></div>
          </div>

              <button class="opc2" id="view-cart">
                <a href="carrito.html" class="animate-link"><span class="material-symbols-outlined"> shopping_basket </span></a>
              </button>
              <div class="dropdown">
                <input type="checkbox" id="dropdown-toggle" class="dropdown-toggle">
                <label for="dropdown-toggle" class="opc2">
                    <span class="material-symbols-outlined" style="cursor: pointer;">account_circle</span>
                </label>
                <div class="dropdown-content">
                  <a href="registroylogin/perfil.php">Mi perfil</a>
                  <a href="./favoritos.html">Favoritos</a>
                  <a href="registroylogin/logout.php">Cerrar sesión</a>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>


      <div class="container"><br></div>
      <div class="container-fluid text-center" style=" background-color: #fab9c3;padding-bottom: 10px;"><h1 style="color: rgb(70, 70, 70);">Perfil de Usuario</h1>
        <div class="container text-start" style=" background-color: #fff;">
          <div class="container text-end" style="padding-top: 10px;"><button id="back-button" class="back-button" style="text-align: end;">Volver</button></div>
            <div class="row">
              <div class="col-4">
                <img src="../<?php echo htmlspecialchars($imagen); ?>" width="400px" height="auto" style="border-radius: 20%;" alt="Imagen de perfil">
              </div>
              <div class="col-8">
                <p>Nombre: <?php echo htmlspecialchars($nombre); ?> <?php echo htmlspecialchars($apellido); ?></p>
                <p>Email: <?php echo htmlspecialchars($email); ?></p>
                <p>Teléfono: <?php echo htmlspecialchars($numero); ?></p>
              </div>
            </div>
            
        </div>
    </div>
    

    <script href="../perfil.js"></script>
</body>
</html>