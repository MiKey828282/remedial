<?php
    // conectar a la base de datos
    $servername = "localhost";
    $username = "root";
    $password = "coyotito4";
    $dbname = "usuarios";

    $conexion = mysqli_connect($servername, $username, $password, $dbname); 

    if(!$conexion){
        die("Conexion fallida: ". mysqli_connect_error());
    }
?>