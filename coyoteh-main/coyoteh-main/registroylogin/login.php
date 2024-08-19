<?php
require 'conexion.php';

if (isset($_POST['login'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM usuarios WHERE email = '$email' and password='$password'";
    $resultado = mysqli_query($conexion, $sql);
    $numero_registros = mysqli_num_rows($resultado);
    
    if ($numero_registros != 0) {
        $usuario = mysqli_fetch_assoc($resultado);
        session_start();
        $_SESSION['user_id'] = $usuario['Id'];
        header("Location: ../index.html");
        exit();
    } else {
        header("Location: ../log.html");
        exit();
    }
}
?>