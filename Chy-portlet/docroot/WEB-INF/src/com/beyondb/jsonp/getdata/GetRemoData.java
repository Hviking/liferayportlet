package com.beyondb.jsonp.getdata;

import java.net.URI;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import net.sf.json.JSONObject;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

public class GetRemoData {

  public static void main(String[] args) {
		  
	  GetRemoData a=new GetRemoData();
		  String ar=a.getStr();
		  System.out.println(ar);
		  }
//	  public static void main(String[] args) {
//		  ClientConfig config = new DefaultClientConfig();
//		  Client client = Client.create(config);
//		  WebResource service = client.resource(getBaseURI());
//		  // Get XML
////		    System.out.println(service.path("countservice").path("bjcountinfo").accept(MediaType.TEXT_XML).get(String.class));
//		  // Get XML for application
//		  System.out.println(service.path("countservice").path("bjcountinfo").accept(MediaType.APPLICATION_JSON).get(String.class));
//		  // Get JSON for application
////		    System.out.println(service.path("countservice").path("bjcountinfo").accept(MediaType.APPLICATION_XML).get(String.class));
//	  }

		  private static URI getBaseURI() {
				return UriBuilder.fromUri("http://192.168.1.125:8060/elbs").build();
//				return UriBuilder.fromUri("http://192.168.1.125:8060/elbs").build();
		  }
		  
		  public String getStr(){
			  ClientConfig config = new DefaultClientConfig();
			    Client client = Client.create(config);
			    WebResource service = client.resource(getBaseURI());
			    // Get XML
//			    System.out.println(service.path("countservice").path("bjcountinfo").accept(MediaType.TEXT_XML).get(String.class));
			    // Get XML for application
//			    System.out.println(service.path("countservice").path("bjcountinfo").accept(MediaType.APPLICATION_JSON).get(String.class));
			    // Get JSON for application
//			    System.out.println(service.path("countservice").path("bjcountinfo").accept(MediaType.APPLICATION_XML).get(String.class));
			
			    return service.path("countservice").path("hy").accept(MediaType.APPLICATION_JSON).get(String.class);
		  }
		  
}
