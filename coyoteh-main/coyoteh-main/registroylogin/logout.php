<?php
session_start();
require 'conexion.php';  // Asegúrate de que el archivo de conexión esté correctamente incluido

// Verificar si hay una sesión activa
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    // Consultar la imagen del usuario
    $sql = "SELECT foto FROM usuarios WHERE Id = $user_id";
    $result = mysqli_query($conexion, $sql);

    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $foto = $row['foto'];

        // Eliminar la imagen del servidor si existe
        if (file_exists($foto)) {
            unlink($foto);  // Eliminar el archivo
        }

        // Opcional: Eliminar la referencia a la imagen en la base de datos
        // $sql = "UPDATE usuarios SET foto = NULL WHERE Id = $user_id";
        // mysqli_query($conexion, $sql);
    }

    // Limpiar la sesión
    $_SESSION = array();

    // Cerrar la sesión
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Destruir la sesión
    session_destroy();
}

// Redirigir al usuario
header("Location: ../log.html");
exit();
?>