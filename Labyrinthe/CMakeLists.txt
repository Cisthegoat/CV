cmake_minimum_required(VERSION 3.26)
project(Test C)

set(CMAKE_C_STANDARD 11)

add_executable(Test main.c
        Labyrinthe.c labyrinthe_io.c
        pile.c
        Utilitaires.c)
