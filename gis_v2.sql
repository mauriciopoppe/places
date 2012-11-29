-- phpMyAdmin SQL Dump
-- version 3.4.5deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 26, 2012 at 10:23 PM
-- Server version: 5.1.58
-- PHP Version: 5.3.6-13ubuntu3.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `gis`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
CREATE TABLE IF NOT EXISTS `administrador` (
  `id_administrador` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(45) NOT NULL,
  `contrasena` varchar(45) NOT NULL,
  `nombres` varchar(45) NOT NULL,
  `apellido_paterno` varchar(45) NOT NULL,
  `apellido_materno` varchar(45) NOT NULL,
  `telefono` int(11) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_administrador`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `administrador`
--

INSERT INTO `administrador` (`id_administrador`, `usuario`, `contrasena`, `nombres`, `apellido_paterno`, `apellido_materno`, `telefono`, `direccion`) VALUES
(1, 'mauricio', '95f407c1ffa7689a0a3f2f21b1bf582fe8359351', 'Mauricio', 'Poppe', 'Humerez', 2788730, 'Obrajes 16 # 60');

-- --------------------------------------------------------

--
-- Table structure for table `atm`
--

DROP TABLE IF EXISTS `atm`;
CREATE TABLE IF NOT EXISTS `atm` (
  `id_atm` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `latitud` decimal(10,6) NOT NULL,
  `longitud` decimal(10,6) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `detalles` varchar(100) DEFAULT NULL,
  `banco_id_banco` int(11) NOT NULL,
  `zona_id_zona` int(11) NOT NULL,
  PRIMARY KEY (`id_atm`),
  KEY `fk_atm_banco1` (`banco_id_banco`),
  KEY `fk_atm_zona1` (`zona_id_zona`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `atm`
--

INSERT INTO `atm` (`id_atm`, `nombre`, `latitud`, `longitud`, `direccion`, `status`, `detalles`, `banco_id_banco`, `zona_id_zona`) VALUES
(1, 'Agencia Central III', '-16.499161', '-68.134074', 'Av. Camacho 1296 Esq. Colon', 1, 'Agencia BNB, Zona Central', 1, 1),
(2, 'Agencia Central IV', '-16.499162', '-68.134071', 'Av. Camacho 1296 Esq. Colon', 1, 'Agencia BNB, Zona Central', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `atm_administrador`
--

DROP TABLE IF EXISTS `atm_administrador`;
CREATE TABLE IF NOT EXISTS `atm_administrador` (
  `tiempo` date NOT NULL,
  `detalles` varchar(200) NOT NULL,
  `atm_id_atm` int(11) NOT NULL,
  `administrador_id_administrador` int(11) NOT NULL,
  PRIMARY KEY (`atm_id_atm`,`administrador_id_administrador`),
  KEY `fk_atm_administrador_atm1` (`atm_id_atm`),
  KEY `fk_atm_administrador_administrador1` (`administrador_id_administrador`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `banco`
--

DROP TABLE IF EXISTS `banco`;
CREATE TABLE IF NOT EXISTS `banco` (
  `id_banco` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `detalles` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_banco`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `banco`
--

INSERT INTO `banco` (`id_banco`, `nombre`, `direccion`, `detalles`) VALUES
(1, 'Banco Nacional de Bolivia', 'Av. Camacho No. 1296 esq. Colon', 'Responsable: Jorge Vargas Rios (gerente comercial)');

-- --------------------------------------------------------

--
-- Table structure for table `ciudad`
--

DROP TABLE IF EXISTS `ciudad`;
CREATE TABLE IF NOT EXISTS `ciudad` (
  `id_ciudad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `nro_zonas` int(11) DEFAULT NULL,
  `departamento_id_departamento` int(11) NOT NULL,
  PRIMARY KEY (`id_ciudad`),
  KEY `fk_provincia_departamento1` (`departamento_id_departamento`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `ciudad`
--

INSERT INTO `ciudad` (`id_ciudad`, `nombre`, `nro_zonas`, `departamento_id_departamento`) VALUES
(1, 'La Paz', 7, 1);

-- --------------------------------------------------------

--
-- Table structure for table `departamento`
--

DROP TABLE IF EXISTS `departamento`;
CREATE TABLE IF NOT EXISTS `departamento` (
  `id_departamento` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `nro_ciudades` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_departamento`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `departamento`
--

INSERT INTO `departamento` (`id_departamento`, `nombre`, `nro_ciudades`) VALUES
(1, 'La Paz', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sucursal`
--

DROP TABLE IF EXISTS `sucursal`;
CREATE TABLE IF NOT EXISTS `sucursal` (
  `id_sucursal` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `latitud` decimal(10,6) NOT NULL,
  `longitud` decimal(10,6) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `atencion_inicio` int(11) NOT NULL,
  `atencion_fin` int(11) NOT NULL,
  `detalles` varchar(255) DEFAULT NULL,
  `banco_id_banco` int(11) NOT NULL,
  `zona_id_zona` int(11) NOT NULL,
  PRIMARY KEY (`id_sucursal`),
  KEY `fk_sucursal_banco1` (`banco_id_banco`),
  KEY `fk_sucursal_zona1` (`zona_id_zona`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `sucursal`
--

INSERT INTO `sucursal` (`id_sucursal`, `nombre`, `latitud`, `longitud`, `direccion`, `atencion_inicio`, `atencion_fin`, `detalles`, `banco_id_banco`, `zona_id_zona`) VALUES
(1, 'Sucursal Camacho', '-16.499408', '-68.134031', 'Av. Camacho 1296 Esq. Colon', 540, 960, 'RESPONSABLE: ESTANYS JAUREGUI MOSCOSO - GERENTE DE BANCA PERSONAS EJAUREGUI@BNB.COM.BO', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sucursal_administrador`
--

DROP TABLE IF EXISTS `sucursal_administrador`;
CREATE TABLE IF NOT EXISTS `sucursal_administrador` (
  `tiempo` int(11) NOT NULL,
  `detalles` varchar(200) NOT NULL,
  `administrador_id_administrador` int(11) NOT NULL,
  `sucursal_id_sucursal` int(11) NOT NULL,
  PRIMARY KEY (`administrador_id_administrador`,`sucursal_id_sucursal`),
  KEY `fk_sucursal_administrador_sucursal1` (`sucursal_id_sucursal`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `zona`
--

DROP TABLE IF EXISTS `zona`;
CREATE TABLE IF NOT EXISTS `zona` (
  `id_zona` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `limites` varchar(100) DEFAULT NULL,
  `ciudad_id_ciudad` int(11) NOT NULL,
  PRIMARY KEY (`id_zona`),
  KEY `fk_zona_provincia1` (`ciudad_id_ciudad`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `zona`
--

INSERT INTO `zona` (`id_zona`, `nombre`, `limites`, `ciudad_id_ciudad`) VALUES
(1, 'Casco Viejo', 'Desde la Plaza Murillo hasta la Plaza del Estudiante', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `atm`
--
ALTER TABLE `atm`
  ADD CONSTRAINT `fk_atm_banco1` FOREIGN KEY (`banco_id_banco`) REFERENCES `banco` (`id_banco`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_atm_zona1` FOREIGN KEY (`zona_id_zona`) REFERENCES `zona` (`id_zona`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `atm_administrador`
--
ALTER TABLE `atm_administrador`
  ADD CONSTRAINT `fk_atm_administrador_administrador1` FOREIGN KEY (`administrador_id_administrador`) REFERENCES `administrador` (`id_administrador`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_atm_administrador_atm1` FOREIGN KEY (`atm_id_atm`) REFERENCES `atm` (`id_atm`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `ciudad`
--
ALTER TABLE `ciudad`
  ADD CONSTRAINT `fk_provincia_departamento1` FOREIGN KEY (`departamento_id_departamento`) REFERENCES `departamento` (`id_departamento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `sucursal`
--
ALTER TABLE `sucursal`
  ADD CONSTRAINT `fk_sucursal_banco1` FOREIGN KEY (`banco_id_banco`) REFERENCES `banco` (`id_banco`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_sucursal_zona1` FOREIGN KEY (`zona_id_zona`) REFERENCES `zona` (`id_zona`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `sucursal_administrador`
--
ALTER TABLE `sucursal_administrador`
  ADD CONSTRAINT `fk_sucursal_administrador_administrador1` FOREIGN KEY (`administrador_id_administrador`) REFERENCES `administrador` (`id_administrador`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_sucursal_administrador_sucursal1` FOREIGN KEY (`sucursal_id_sucursal`) REFERENCES `sucursal` (`id_sucursal`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `zona`
--
ALTER TABLE `zona`
  ADD CONSTRAINT `fk_zona_provincia1` FOREIGN KEY (`ciudad_id_ciudad`) REFERENCES `ciudad` (`id_ciudad`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
