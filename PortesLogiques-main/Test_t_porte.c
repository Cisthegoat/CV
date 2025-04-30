//
// Created by cedri on 2023-12-03.
//

#include "Test_t_porte.h"


void test_t_porte_init(void)
{
    t_porte *porte = t_porte_init(1, PORTE_ET);

    if (porte != NULL && porte->type == PORTE_ET) {

         printf("Test t_porte_init reussi\n");

         printf("La porte : %s\n", porte->nom);
    }
    else{

        printf("Échec du test t_porte_init\n");
    }


    t_porte_destroy(porte);
}



void test_t_porte_calculer_sorties(void)
{

    t_porte *testPorte = t_porte_init(1, PORTE_ET);

    // A Changer selon le contexte( une entre pour NOT)
    //On peut changer la valeur pour tester
    t_pin_entree_set_valeur(testPorte->entrees[0], 1);
    t_pin_entree_set_valeur(testPorte->entrees[1], 0);

    // Fonction a tester
    t_porte_calculer_sorties(testPorte);


    int logique = t_pin_sortie_get_valeur(testPorte->sortie);

    //Changer selon la porte
    if (logique == 1) {
        printf("Test Reussi\n");
    } else {
        printf("Test t_porte_calculer_sorties: (Attendue: 0, Actuelle: %d)\n", logique);
    }


    t_porte_destroy(testPorte);


}




void test_t_porte_propager_signal(void)
{
    t_porte *gate = t_porte_init(1, PORTE_ET);














    t_porte *porte2 = t_porte_init(2, PORTE_ET);

    t_pin_sortie *source1 = t_pin_sortie_init();
    t_pin_sortie *source2 = t_pin_sortie_init();

    t_pin_entree *entree1 = t_pin_entree_init();
    t_pin_entree *entree2 = t_pin_entree_init();

    t_pin_entree_relier(entree1, source1);
    t_pin_entree_relier(entree2, source2);

    t_porte_relier(porte2,0,entree1);
    t_porte_relier(porte2,1,entree2);

    // test a cause porte et si les deux sources = 1, une sortie = 1
    t_pin_sortie_set_valeur(source1, -1);
    t_pin_sortie_set_valeur(source2, -1);



    printf("Valeur de la source1 avant propagation : %d\n", t_pin_sortie_get_valeur(source1));
    printf("Valeur de la source2 avant propagation : %d\n", t_pin_sortie_get_valeur(source2));
    printf("Sortie de la porte  avant propagation : %d\n", t_pin_sortie_get_valeur(porte2->sortie));


    if(t_porte_propager_signal(porte2) == 1)
    {
        printf("Test reussi pour ce type de porte\n");
    }
    else
    {
            printf("Echec du test\n");
    }

    printf("Valeur de la source1 après propagation : %d\n", t_pin_sortie_get_valeur(source1));
    printf("Valeur de la source2 après propagation : %d\n", t_pin_sortie_get_valeur(source2));
    printf("Valeur de la sortie de la porte après propagation : %d\n", t_pin_sortie_get_valeur(porte2->sortie));


    t_porte_destroy(porte2);
    t_pin_sortie_destroy(source1);
    t_pin_sortie_destroy(source2);
    t_pin_entree_destroy(entree1);
    t_pin_entree_destroy(entree2);


}
