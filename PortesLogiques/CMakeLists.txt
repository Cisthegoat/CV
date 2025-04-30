cmake_minimum_required(VERSION 3.26)
project(porte_logiques C)

set(CMAKE_C_STANDARD 11)


add_executable(porte_logiques t_file_porte.c t_pin_entree.c t_pin_sortie.c circuit_logique.c t_entree.c t_circuit.c t_porte.c t_sortie.c test_t_entree.c Test_t_porte.c
        Test_t_sortie.c)

