//
// Created by cedri on 2023-12-03.
//

#include "Test_t_sortie.h"

void test_sortie_init(void)
{
    int test = 1;

    t_sortie *sortie6 = t_sortie_init(test);

    if(sortie6 != NULL)
    {
        printf(" Nom: %s ID: %d\n",sortie6->nom,sortie6->id);
    }

    free(sortie6->nom);

    free(sortie6);

}

void test_t_sortie_get_pin(void){

    t_sortie *sortie = t_sortie_init(1);

    t_pin_entree *pin = t_sortie_get_pin(sortie);


    if(pin != NULL)
    {
        printf("Reussi\n");
    }
    else{
        printf("Echec\n");
    }

    t_sortie_destroy(sortie);
}

void test_t_sortie_est_reliee(void)
{
    t_sortie *sortie3 = t_sortie_init(2);

    t_pin_sortie *pin= t_pin_sortie_init();

    t_pin_sortie_ajouter_lien(pin,sortie3->pin);


    if(t_entree_est_reliee(sortie3) == 1)
    {
        printf("Test Relier entree : Reussi\n");
    }
    else
    {
        printf("PAs Reussi\n");
    }

}