//
// Created by cedri on 2023-11-20.
//

#include "t_circuit.h"

t_circuit* t_circuit_init(void)
{
    t_circuit* circuit;

    circuit = (t_circuit*)malloc(sizeof(t_circuit));


    circuit->nb_entrees=0;
    circuit ->nb_portes=0;
    circuit -> nb_sorties=0;

    if(circuit == NULL)
    {

        return NULL;
    }




    return circuit;
}

void t_circuit_destroy(t_circuit *circuit)
{

    free(circuit);
}

t_porte* t_circuit_ajouter_porte(t_circuit *circuit, e_types_portes le_type)
{
    t_porte* nouvelle_porte;

    if(circuit->nb_portes<CIRCUIT_MAX_PORTES)
    {
        nouvelle_porte = t_porte_init(circuit->nb_portes,le_type);
        circuit->nb_portes++;
        circuit->portes[circuit->nb_portes - 1] = nouvelle_porte;
     // ajouter a la porte
        return nouvelle_porte;
    }
    return NULL;

}

t_entree* t_circuit_ajouter_entree(t_circuit * circuit)
{
    t_entree* nouvelle_entree;

    if(circuit->nb_entrees < MAX_ENTREES)
    {
        nouvelle_entree = t_entree_init(circuit->nb_entrees);


        circuit->nb_entrees++;
        circuit->entrees[circuit->nb_entrees - 1] = nouvelle_entree;
        return nouvelle_entree;
    }


    return NULL;
}

t_sortie* t_circuit_ajouter_sortie(t_circuit * circuit)
{
    t_sortie* nouvelle_sortie;

    if(circuit->nb_sorties < MAX_SORTIES)
    {
        nouvelle_sortie = t_sortie_init(circuit->nb_sorties);


        circuit->nb_sorties++;
        circuit->sorties[circuit->nb_sorties - 1] = nouvelle_sortie;
        return nouvelle_sortie;
    }


    return NULL;
}

int t_circuit_est_valide(t_circuit *circuit)
{
    for(int i=0;i<circuit->nb_entrees;i++)
    {
        if (t_entree_est_reliee(circuit->entrees[i]) == 0)
        {

            return 0;
        }
    }

    for(int i=0;i<circuit->nb_sorties;i++)
    {
        if(t_sortie_est_reliee(circuit->sorties[i]) == 0)
        {

            return 0;
        }
    }

    for(int i=0;i<circuit->nb_portes;i++)
    {
        if(t_porte_est_reliee(circuit->portes[i]) == 0)
        {

            return 0;
        }
    }


    return 1;

}

int t_circuit_appliquer_signal(t_circuit * circuit, int signal[], int nb_bits)
{
    nb_bits = 0;

    for(int i=0;i<MAX_ENTREES;i++)
    {
       if(signal[i] == 1 || signal[i] == 0)
       {

           nb_bits ++;
       }
       else
       {

           i = MAX_ENTREES;
       }
    }

    if(nb_bits>= circuit->nb_entrees)
    {
        for(int i=0;i<circuit->nb_entrees;i++)
        {
            t_pin_sortie_set_valeur(circuit->entrees[i]->pin,signal[i]);

        }

        return 1;
    }


    return 0;
}

void t_circuit_reset(t_circuit *circuit)
{
    for(int i=0;i<circuit->nb_entrees;i++)
    {

        t_entree_reset(circuit->entrees[i]);

    }

    for(int i=0;i<circuit->nb_sorties;i++)
    {
        t_sortie_reset(circuit->sorties[i]);

    }

    for(int i=0;i<circuit->nb_portes;i++)
    {
        t_porte_reset(circuit->portes[i]);

    }
}

int t_circuit_propager_signal(t_circuit *circuit)
{
    t_file_porte * file;
    t_porte* porte_courante;
    int nb_portes = circuit->nb_portes;
    int iteration = 0;

    file = t_file_porte_initialiser(CIRCUIT_MAX_PORTES);

    if(t_circuit_est_valide(circuit) == 0)
    {

        return 0;
    }

    for(int i = 0;i<circuit->nb_entrees;i++)
    {
        t_entree_propager_signal(circuit->entrees[i]);

    }

    for (int i = 0; i < circuit->nb_portes; i++)
    {
        t_file_porte_enfiler(file,circuit->portes[i]);

    }

    while(t_file_porte_est_vide(file) != 1 && iteration < nb_portes * (nb_portes+1)/2)
    {
        porte_courante = t_file_porte_defiler(file);
        t_porte_propager_signal(porte_courante);

        if( t_porte_propager_signal(porte_courante) == 0)
        {
            t_file_porte_enfiler(file,porte_courante);

        }

        iteration++;
    }

    if(t_file_porte_est_vide(file) != 1)
    {



        return 0;
    }


    return 1;
}






