import { useState, useEffect } from 'react';
import { invitacionGrupoService } from '../services/invitacionGrupoService';

export const useInvitacionesPendientes = (user) => {
  const [cantidadPendientes, setCantidadPendientes] = useState(0);

  useEffect(() => {
    const fetchInvitaciones = async () => {
      if (!user) {
        setCantidadPendientes(0);
        return;
      }

      try {
        const invitaciones = await invitacionGrupoService.misInvitaciones();
        setCantidadPendientes(invitaciones.length);
      } catch (error) {
        console.error('Error al cargar invitaciones:', error);
        setCantidadPendientes(0);
      }
    };

    fetchInvitaciones();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchInvitaciones, 30000);

    return () => clearInterval(interval);
  }, [user]);

  return cantidadPendientes;
};