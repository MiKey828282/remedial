<?php
    require 'conexion.php';

    if (isset($_POST['registro'])) {
        $nombre = $_POST['first_name'];
        $apellido = $_POST['last_name'];
        $email = $_POST['email'];
        $numero = $_POST['phone'];
        $contraseña = $_POST['password'];
    
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            $foto = $_FILES["foto"]["name"];
            $ruta_temp = $_FILES["foto"]["tmp_name"];
            $destino = "../imgperfiles/{$foto}";
    
            if (move_uploaded_file($ruta_temp, $destino)) {
                $ruta_foto = "imgperfiles/{$foto}";
                $sql = "INSERT INTO usuarios (Id, first_name, last_name, email, phone, password, foto) VALUES (null, '$nombre', '$apellido', '$email', '$numero', '$contraseña', '$ruta_foto')";
                $resultado = mysqli_query($conexion, $sql);
                
                if ($resultado) {
                    header("Location: ../log.html");
                    exit();
                } else {
                    echo "No se pudo. " . mysqli_error($conexion);
                }
            } else {
                echo "Error al subir el archivo";
            }
        } else {
            echo "No se ha subido ninguna imagen o hubo un error en la subida.";
        }
    }
?>