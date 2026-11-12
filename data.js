const N=(id,name,rel,parent,risk,desc,evid="",flags="",src="")=>({id,name,rel,parent,risk,photo:"",doc:"",desc,evid,flags,src,upd:"",bank:{cliente:false,productos:[]},fid:{cliente:false,productos:[]}});
window.DATA=[
N("c","Gustavo Petro","c",null,"na","Persona expuesta políticamente (PEP). Sujeto central del mapa."),
N("alc","Verónica Alcocer","afin","c","na","Esposa según prensa.","Verificar estado civil vigente.","","Semana; RCN"),
N("nic","Nicolás Petro Burgos","fam1","c","alto","Hijo mayor.","Acusado por enriquecimiento ilícito y lavado de activos; juicio en curso. Declara ser inocente. Sin condena verificada.","Proceso penal en curso.","La FM; RCN; Infobae"),
N("and","Andrea Petro","fam1","c","na","Hija.","","","Infobae"),
N("adr","Andrés Petro","fam1","c","na","Hijo.","","","Infobae"),
N("sof","Sofía Petro","fam1","c","na","Hija.","","","RCN"),
N("ant","Antonella Petro","fam1","c","na","Hija menor.","","","Semana"),
N("nal","Nicolás Alcocer","afin","c","na","Hijastro (afinidad).","","","Semana"),
N("jfp","Juan Fernando Petro","fam2","c","medio","Hermano.","En 2023 la prensa reportó presunto tráfico de influencias. Verificar estado procesal.","Reportes de prensa; sin sentencia verificada.","El País; La Silla Vacía"),
N("day","Day Vásquez","afin","nic","medio","Exesposa de Nicolás Petro.","Imputada en 2023 por lavado de activos. Verificar estado procesal.","Proceso penal asociado.","La FM"),
N("gdl","Grupo Delta Ltda.","pj","nic","medio","Persona jurídica mencionada en la acusación.","Tesis de la Fiscalía, no sentencia. Verificar NIT en RUES.","Mencionada en la acusación.","La FM"),
N("fec","Fundación Esquipulas","pj","c","na","Fundación vinculada a la actividad política.","Verificar contratación pública.","","Registro público"),
N("adp","Alfonso Prada","amigo","c","na","Colaborador cercano.","Verificar contratos y encargos.","","Presidencia; prensa"),
N("cav","Claudia López","pol","adp","na","Exalcaldesa de Bogotá; relación política.","","","Prensa"),
N("gbr","Gustavo Bolívar","amigo","c","na","Aliado político.","Verificar declaraciones patrimoniales.","","Congreso; prensa"),
N("mar","María José Pizarro","pol","gbr","na","Representante a la Cámara; relación política.","","","Congreso"),
N("ext","Consignante tercero (caso DOE)","ext","c","na","Plantilla para registrar al consignante de la DOE.","Fecha, monto, oficina, vínculo.","","Interno"),
N("ter2","Proveedor Fondo Paz","neg","gdl","medio","Proveedor en contratos de la entidad.","Verificar objeto y valores en SECOP.","","SECOP"),
N("ter3","Fiduciaria Central","pj","fec","na","Administra recursos de la fundación.","Verificar reportes UIAF.","","Superfinanciera")
];