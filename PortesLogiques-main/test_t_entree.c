//
// Created by cedri on 2023-11-20.
//

#include "test_t_entree.h"

void test_entree_init(void)
{
    int test = 1;

     t_entree *entree6 = t_entree_init(test);

    if(entree6 != NULL)
    {
        printf(" Nom: %s ID: %d\n",entree6->nom,entree6->id);
    }

    free(entree6->nom);

    free(entree6);

}


void test_entree_destroy(void) {

    t_entree *my_entree = t_entree_init(1);


    if (my_entree != NULL) {
        printf("Avant: ID = %d, Nom = %s\n", my_entree->id, my_entree->nom);


    }
    //t_entree_destroy(&my_entree);

    my_entree = NULL;

    if (my_entree == NULL) {

        printf("\nLa memoire a ete liberer avec succes\n");
    } else {
        printf("La mémoire n'a pas ete liberer\n");
    }
}


void test_t_entree_get_pin(void)
{
t_entree *entre2 = t_entree_init(1);

t_pin_sortie *pin = t_entree_get_pin(entre2);

if(pin != NULL)
{
    printf("Reussi\n");
}
else{
    printf("Echec\n");
}

t_entree_destroy(entre2);
}



void test_t_entree_est_reliee(void)
{
    t_entree *entre3 = t_entree_init(2);

    t_pin_entree *pin= t_pin_entree_init();

    t_pin_sortie_ajouter_lien(entre3->pin,pin);


    if(t_entree_est_reliee(entre3) == 1)
    {
        printf("Test Relier entree : Reussi\n");
    }
    else
    {
        printf("PAs Reussi\n");
    }

}